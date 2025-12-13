import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGovernance, PROPOSAL_STATES } from "@/hooks/useGovernance";
import { useWallet } from "@/hooks/useWallet";
import { 
  FileText, 
  ArrowLeft, 
  ThumbsUp, 
  ThumbsDown, 
  Minus, 
  Loader2, 
  Wallet,
  Check,
  AlertCircle
} from "lucide-react";

// Example proposals - In production, these would come from blockchain events
const EXAMPLE_PROPOSALS = [
  {
    id: "1",
    title: "Proposta #1 - Aumentar Recompensas de Staking",
    description: "Proposta para aumentar as recompensas de staking de 5% para 8% ao ano para incentivar mais participação na rede.",
    proposer: "0x1234...5678",
    forVotes: "150000",
    againstVotes: "45000",
    abstainVotes: "5000",
    state: 1,
    voteStart: Date.now() - 86400000,
    voteEnd: Date.now() + 86400000 * 6,
  },
  {
    id: "2",
    title: "Proposta #2 - Novo Sistema de Governança",
    description: "Implementação de um novo sistema de governança com votação quadrática para dar mais poder aos pequenos holders.",
    proposer: "0xabcd...efgh",
    forVotes: "200000",
    againstVotes: "180000",
    abstainVotes: "20000",
    state: 1,
    voteStart: Date.now() - 172800000,
    voteEnd: Date.now() + 86400000 * 3,
  },
  {
    id: "3",
    title: "Proposta #3 - Parceria com Protocolo DeFi",
    description: "Aprovar parceria estratégica com protocolo DeFi para integração de lending e borrowing com TEA.",
    proposer: "0x9876...5432",
    forVotes: "300000",
    againstVotes: "50000",
    abstainVotes: "10000",
    state: 4,
    voteStart: Date.now() - 604800000,
    voteEnd: Date.now() - 86400000,
  },
];

const Proposals = () => {
  const { walletAddress } = useWallet();
  const { isVotingActive, votingPower, castVote, isLoading, hasVoted } = useGovernance();
  const [votedProposals, setVotedProposals] = useState<Record<string, boolean>>({});
  const [votingProposalId, setVotingProposalId] = useState<string | null>(null);

  const formatNumber = (value: string) => {
    const num = parseFloat(value);
    if (num === 0) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
    if (num >= 1000) return (num / 1000).toFixed(2) + "K";
    return num.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
  };

  const getStateInfo = (state: number) => {
    return PROPOSAL_STATES[state as keyof typeof PROPOSAL_STATES] || { label: "Desconhecido", color: "bg-gray-500" };
  };

  const calculatePercentage = (votes: string, total: string) => {
    const v = parseFloat(votes);
    const t = parseFloat(total);
    if (t === 0) return 0;
    return (v / t) * 100;
  };

  const handleVote = async (proposalId: string, support: number) => {
    setVotingProposalId(proposalId);
    const success = await castVote(proposalId, support);
    if (success) {
      setVotedProposals(prev => ({ ...prev, [proposalId]: true }));
    }
    setVotingProposalId(null);
  };

  const getRemainingTime = (endTime: number) => {
    const remaining = endTime - Date.now();
    if (remaining <= 0) return "Encerrada";
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h restantes`;
    return `${hours}h restantes`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/governanca" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Governança
            </Link>
            
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-display font-bold">Propostas</h1>
            </div>
            <p className="text-muted-foreground">
              Vote nas propostas ativas para participar das decisões do protocolo.
            </p>
          </div>

          {!walletAddress ? (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Conecte sua Carteira</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Conecte sua carteira MetaMask para ver e votar nas propostas.
                </p>
              </CardContent>
            </Card>
          ) : !isVotingActive ? (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-16 w-16 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Votos Não Ativados</h3>
                <p className="text-muted-foreground text-center max-w-md mb-4">
                  Você precisa ativar seus votos na página de governança antes de votar nas propostas.
                </p>
                <Button asChild>
                  <Link to="/governanca">Ir para Governança</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Voting Power Info */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium">Votos Ativados</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground">Poder de voto: </span>
                      <span className="font-bold text-primary">{formatNumber(votingPower)} TEA</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Proposals List */}
              {EXAMPLE_PROPOSALS.map((proposal) => {
                const stateInfo = getStateInfo(proposal.state);
                const totalVotes = (parseFloat(proposal.forVotes) + parseFloat(proposal.againstVotes) + parseFloat(proposal.abstainVotes)).toString();
                const isActive = proposal.state === 1;
                const hasUserVoted = votedProposals[proposal.id];

                return (
                  <Card key={proposal.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg">{proposal.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {proposal.description}
                          </CardDescription>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`${stateInfo.color} text-white shrink-0`}
                        >
                          {stateInfo.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Vote Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-green-500">
                              <ThumbsUp className="h-4 w-4" />
                              A Favor
                            </span>
                            <span>{formatNumber(proposal.forVotes)} ({calculatePercentage(proposal.forVotes, totalVotes).toFixed(1)}%)</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full transition-all"
                              style={{ width: `${calculatePercentage(proposal.forVotes, totalVotes)}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-red-500">
                              <ThumbsDown className="h-4 w-4" />
                              Contra
                            </span>
                            <span>{formatNumber(proposal.againstVotes)} ({calculatePercentage(proposal.againstVotes, totalVotes).toFixed(1)}%)</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-500 rounded-full transition-all"
                              style={{ width: `${calculatePercentage(proposal.againstVotes, totalVotes)}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Minus className="h-4 w-4" />
                              Abstenção
                            </span>
                            <span>{formatNumber(proposal.abstainVotes)} ({calculatePercentage(proposal.abstainVotes, totalVotes).toFixed(1)}%)</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gray-500 rounded-full transition-all"
                              style={{ width: `${calculatePercentage(proposal.abstainVotes, totalVotes)}%` }}
                            />
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/50">
                          <span>Propositor: {proposal.proposer}</span>
                          <span>{getRemainingTime(proposal.voteEnd)}</span>
                        </div>

                        {/* Voting Buttons */}
                        {isActive && !hasUserVoted && (
                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              className="flex-1 border-green-500 text-green-500 hover:bg-green-500/10"
                              onClick={() => handleVote(proposal.id, 1)}
                              disabled={isLoading && votingProposalId === proposal.id}
                            >
                              {isLoading && votingProposalId === proposal.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <ThumbsUp className="h-4 w-4 mr-2" />
                                  A Favor
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
                              onClick={() => handleVote(proposal.id, 0)}
                              disabled={isLoading && votingProposalId === proposal.id}
                            >
                              {isLoading && votingProposalId === proposal.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <ThumbsDown className="h-4 w-4 mr-2" />
                                  Contra
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleVote(proposal.id, 2)}
                              disabled={isLoading && votingProposalId === proposal.id}
                            >
                              {isLoading && votingProposalId === proposal.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Minus className="h-4 w-4 mr-2" />
                                  Abster
                                </>
                              )}
                            </Button>
                          </div>
                        )}

                        {hasUserVoted && (
                          <div className="flex items-center justify-center gap-2 py-2 bg-muted/50 rounded-lg">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-500">Você já votou nesta proposta</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Proposals;
