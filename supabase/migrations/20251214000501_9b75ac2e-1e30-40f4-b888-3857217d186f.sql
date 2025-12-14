-- Add restrictive INSERT policy that blocks all direct user inserts
-- This ensures only the edge function (using service role) can insert rewards
CREATE POLICY "Block direct user inserts" 
ON public.tea_rewards 
FOR INSERT 
TO authenticated
WITH CHECK (false);

-- Add comment explaining the architecture decision
COMMENT ON TABLE public.tea_rewards IS 'Reward claims are inserted exclusively via the claim-tea-reward edge function using service role. Direct user inserts are blocked by RLS policy.';