import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TEA_TOKEN_ADDRESS = "0x83dc1E40D60d0b96109139364f892E46Bea96876";
const TEA_DECIMALS = 6;
const REWARD_AMOUNT = 100; // 100 TEA tokens
const MODULE_3_QUIZ_ID = "module-3-quiz";

// Minimal ERC20 ABI for transfer
const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)"
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      throw new Error('Server configuration error');
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    console.log(`Processing TEA reward claim for user: ${user.id}`);

    // Check if user has completed module 3 quiz
    const { data: quizProgress, error: quizError } = await supabase
      .from('quiz_progress')
      .select('passed')
      .eq('user_id', user.id)
      .eq('quiz_id', MODULE_3_QUIZ_ID)
      .single();

    if (quizError || !quizProgress?.passed) {
      console.log(`User ${user.id} has not passed module 3 quiz`);
      return new Response(
        JSON.stringify({ success: false, error: 'Module 3 quiz not completed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check if user already claimed the reward
    const { data: existingClaim, error: claimCheckError } = await supabase
      .from('tea_rewards')
      .select('id')
      .eq('user_id', user.id)
      .eq('reward_type', 'module_3_completion')
      .single();

    if (existingClaim) {
      console.log(`User ${user.id} already claimed module 3 reward`);
      return new Response(
        JSON.stringify({ success: false, error: 'Reward already claimed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get user's wallet address
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('wallet_address')
      .eq('user_id', user.id)
      .eq('is_primary', true)
      .single();

    if (walletError || !wallet) {
      console.log(`User ${user.id} has no primary wallet connected`);
      return new Response(
        JSON.stringify({ success: false, error: 'No wallet connected. Please connect your wallet first.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Sending ${REWARD_AMOUNT} TEA to wallet: ${wallet.wallet_address}`);

    // Get distributor private key
    const distributorPrivateKey = Deno.env.get('TEA_DISTRIBUTOR_PRIVATE_KEY');
    if (!distributorPrivateKey) {
      throw new Error('Distributor private key not configured');
    }

    // Use ethers to send the transaction
    const { ethers } = await import("https://esm.sh/ethers@6.15.0");

    const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology");
    const distributorWallet = new ethers.Wallet(distributorPrivateKey, provider);

    const teaToken = new ethers.Contract(TEA_TOKEN_ADDRESS, ERC20_ABI, distributorWallet);

    // Calculate amount with decimals
    const amountWithDecimals = ethers.parseUnits(REWARD_AMOUNT.toString(), TEA_DECIMALS);

    // Check distributor balance
    const balance = await teaToken.balanceOf(distributorWallet.address);
    if (balance < amountWithDecimals) {
      console.error(`Insufficient balance in distributor wallet. Balance: ${ethers.formatUnits(balance, TEA_DECIMALS)} TEA`);
      throw new Error('Insufficient tokens in distributor wallet');
    }

    // Send the transaction
    const tx = await teaToken.transfer(wallet.wallet_address, amountWithDecimals);
    console.log(`Transaction sent: ${tx.hash}`);

    // Wait for confirmation
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);

    // Record the reward claim using service role
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!serviceRoleKey) {
      console.error('Missing service role key');
      throw new Error('Server configuration error');
    }
    
    const supabaseServiceRole = createClient(supabaseUrl, serviceRoleKey);

    const { error: insertError } = await supabaseServiceRole
      .from('tea_rewards')
      .insert({
        user_id: user.id,
        wallet_address: wallet.wallet_address,
        amount: REWARD_AMOUNT,
        reward_type: 'module_3_completion',
        tx_hash: tx.hash
      });

    if (insertError) {
      console.error('Error recording reward:', insertError);
      // Don't fail the request since the transfer already happened
    }

    return new Response(
      JSON.stringify({
        success: true,
        txHash: tx.hash,
        amount: REWARD_AMOUNT
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing reward claim:', error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
