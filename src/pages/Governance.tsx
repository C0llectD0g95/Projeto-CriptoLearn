import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGovernance } from "@/hooks/useGovernance";
import { useWallet } from "@/hooks/useWallet";
import { Vote, FileText, Check, Loader2, Wallet, Leaf } from "lucide-react";

const Governance = () => {
  const { walletAddress } = useWallet();
  const { 
    votingPower, 
    teaBalance, 
    isLoading, 
    activateVoting, 
    isVotingActive,
    delegatee 
  } = useGovernance();

  const formatNumber = (value: string) => {
    const num = parseFloat(value);
    if (num === 0) return "0";
    if (num < 0.0001) return "< 0.0001";
    return num.toLocaleString("pt-BR", { maximumFractionDigits: 4 });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-display font-bold">Governança TEA</h1>
            </div>
            <p className="text-muted-foreground">
              Participe das decisões do protocolo votando nas propostas da comunidade.
            </p>
          </div>

          {!walletAddress ? (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Conecte sua Carteira</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Para participar da governança, conecte sua carteira MetaMask clicando no botão "Conectar Carteira" no menu.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Voting Power Card */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Vote className="h-5 w-5 text-primary" />
                    Poder de Voto
                  </CardTitle>
                  <CardDescription>
                    Seu poder de voto atual no protocolo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-primary">
                        {formatNumber(votingPower)} TEA
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Saldo disponível: {formatNumber(teaBalance)} TEA
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        {isVotingActive ? (
                          <>
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-500">
                              Votos Ativados
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Votos não ativados
                          </span>
                        )}
                      </div>
                      {delegatee && delegatee.toLowerCase() !== walletAddress?.toLowerCase() && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Delegado para: {delegatee.slice(0, 6)}...{delegatee.slice(-4)}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Activate Voting Card */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    Ativar Votos
                  </CardTitle>
                  <CardDescription>
                    Ative seus votos para participar da governança
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Para votar nas propostas, você precisa ativar (delegar para si mesmo) seus tokens TEA. 
                      Isso permite que seus tokens contem como poder de voto.
                    </p>
                    
                    <Button 
                      onClick={activateVoting}
                      disabled={isLoading || isVotingActive}
                      className="w-full"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : isVotingActive ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Votos Já Ativados
                        </>
                      ) : (
                        <>
                          <Vote className="h-4 w-4 mr-2" />
                          Ativar Meus Votos
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Proposals Card */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Propostas
                  </CardTitle>
                  <CardDescription>
                    Veja e vote nas propostas ativas da comunidade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Acesse a página de propostas para ver todas as propostas de governança, 
                      seus detalhes e votar nas que estão ativas.
                    </p>
                    
                    <Button 
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full"
                      disabled={!isVotingActive}
                    >
                      <Link to="/propostas">
                        <FileText className="h-4 w-4 mr-2" />
                        Ver Propostas
                      </Link>
                    </Button>
                    
                    {!isVotingActive && (
                      <p className="text-xs text-muted-foreground text-center">
                        Ative seus votos primeiro para poder votar nas propostas.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Governance;
