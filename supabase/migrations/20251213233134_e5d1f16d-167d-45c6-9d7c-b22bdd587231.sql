-- Create table to track TEA rewards
CREATE TABLE public.tea_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  wallet_address TEXT NOT NULL,
  amount INTEGER NOT NULL,
  reward_type TEXT NOT NULL,
  tx_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tea_rewards ENABLE ROW LEVEL SECURITY;

-- Users can view their own rewards
CREATE POLICY "Users can view their own rewards"
ON public.tea_rewards
FOR SELECT
USING (auth.uid() = user_id);

-- Only the service role can insert rewards (edge function uses service role)
-- No insert policy for regular users since rewards are claimed via edge function

-- Create index for faster lookups
CREATE INDEX idx_tea_rewards_user_id ON public.tea_rewards(user_id);
CREATE INDEX idx_tea_rewards_reward_type ON public.tea_rewards(reward_type);