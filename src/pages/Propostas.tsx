import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, ThumbsDown, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: "active" | "passed" | "rejected" | "pending";
  votes_for: number;
  votes_against: number;
  created_at: string;
  ends_at: string | null;
}

interface UserVote {
  proposal_id: string;
  vote_type: string;
}

const statusConfig = {
  active: { label: "Ativa", variant: "default" as const, icon: Clock },
  passed: { label: "Aprovada", variant: "success" as const, icon: CheckCircle },
  rejected: { label: "Rejeitada", variant: "destructive" as const, icon: XCircle },
  pending: { label: "Pendente", variant: "secondary" as const, icon: Clock },
};

const Propostas = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProposals();
    if (user) {
      fetchUserVotes();
    }
  }, [user]);

  const fetchProposals = async () => {
    try {
      const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProposals(data || []);
    } catch (error) {
      console.error("Erro ao carregar propostas:", error);
      toast.error("Erro ao carregar propostas");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("proposal_votes")
        .select("proposal_id, vote_type")
        .eq("user_id", user.id);

      if (error) throw error;
      setUserVotes(data || []);
    } catch (error) {
      console.error("Erro ao carregar votos:", error);
    }
  };

  const handleVote = async (proposalId: string, voteType: "for" | "against") => {
    if (!user) {
      toast.error("Faça login para votar");
      return;
    }

    setVotingId(proposalId);
    
    try {
      const existingVote = userVotes.find((v) => v.proposal_id === proposalId);

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote
          const { error } = await supabase
            .from("proposal_votes")
            .delete()
            .eq("proposal_id", proposalId)
            .eq("user_id", user.id);

          if (error) throw error;
          toast.success("Voto removido");
        } else {
          // Update vote
          const { error } = await supabase
            .from("proposal_votes")
            .update({ vote_type: voteType })
            .eq("proposal_id", proposalId)
            .eq("user_id", user.id);

          if (error) throw error;
          toast.success("Voto atualizado");
        }
      } else {
        // Insert new vote
        const { error } = await supabase.from("proposal_votes").insert({
          proposal_id: proposalId,
          user_id: user.id,
          vote_type: voteType,
        });

        if (error) throw error;
        toast.success("Voto registrado");
      }

      await fetchProposals();
      await fetchUserVotes();
    } catch (error) {
      console.error("Erro ao votar:", error);
      toast.error("Erro ao registrar voto");
    } finally {
      setVotingId(null);
    }
  };

  const getUserVote = (proposalId: string) => {
    return userVotes.find((v) => v.proposal_id === proposalId)?.vote_type;
  };

  const getVotePercentage = (proposal: Proposal) => {
    const total = proposal.votes_for + proposal.votes_against;
    if (total === 0) return 50;
    return (proposal.votes_for / total) * 100;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Propostas de Governança</h1>
          <p className="text-muted-foreground">
            Participe das decisões da comunidade votando nas propostas ativas.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : proposals.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Nenhuma proposta encontrada.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {proposals.map((proposal) => {
              const status = statusConfig[proposal.status];
              const StatusIcon = status.icon;
              const userVote = getUserVote(proposal.id);
              const votePercentage = getVotePercentage(proposal);
              const isVoting = votingId === proposal.id;
              const totalVotes = proposal.votes_for + proposal.votes_against;

              return (
                <Card key={proposal.id} className="glass-card overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-xl">{proposal.title}</CardTitle>
                        <CardDescription className="text-sm">
                          Criada em {formatDate(proposal.created_at)}
                          {proposal.ends_at && ` • Termina em ${formatDate(proposal.ends_at)}`}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={status.variant === "success" ? "default" : status.variant}
                        className={status.variant === "success" ? "bg-crypto-success" : ""}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-foreground/80">{proposal.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-crypto-success font-medium flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          A favor: {proposal.votes_for}
                        </span>
                        <span className="text-muted-foreground">
                          Total: {totalVotes} votos
                        </span>
                        <span className="text-destructive font-medium flex items-center gap-1">
                          Contra: {proposal.votes_against}
                          <ThumbsDown className="h-4 w-4" />
                        </span>
                      </div>
                      <div className="relative">
                        <Progress value={votePercentage} className="h-3" />
                        <div
                          className="absolute top-0 left-1/2 h-full w-0.5 bg-foreground/30 -translate-x-1/2"
                          aria-hidden
                        />
                      </div>
                    </div>

                    {proposal.status === "active" && (
                      <div className="flex gap-3 pt-2">
                        <Button
                          variant={userVote === "for" ? "default" : "outline"}
                          className={userVote === "for" ? "bg-crypto-success hover:bg-crypto-success/90" : ""}
                          onClick={() => handleVote(proposal.id, "for")}
                          disabled={isVoting}
                        >
                          {isVoting ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <ThumbsUp className="h-4 w-4 mr-2" />
                          )}
                          A favor
                        </Button>
                        <Button
                          variant={userVote === "against" ? "destructive" : "outline"}
                          onClick={() => handleVote(proposal.id, "against")}
                          disabled={isVoting}
                        >
                          {isVoting ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <ThumbsDown className="h-4 w-4 mr-2" />
                          )}
                          Contra
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Propostas;
