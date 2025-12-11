-- Drop the trigger first (if exists)
DROP TRIGGER IF EXISTS on_vote_change ON public.proposal_votes;

-- Drop the tables (proposal_votes first due to foreign key reference)
DROP TABLE IF EXISTS public.proposal_votes;
DROP TABLE IF EXISTS public.proposals;

-- Drop the function
DROP FUNCTION IF EXISTS public.update_proposal_votes();

-- Drop the enum type
DROP TYPE IF EXISTS public.proposal_status;