import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Wallet, 
  TrendingUp, 
  Clock, 
  Trophy, 
  Target,
  ArrowRight,
  ExternalLink,
  Copy,
  CheckCircle2,
  Play
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { walletAddress, balance, savedWallets } = useWallet();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Mock data for courses in progress
  const coursesInProgress = [
    {
      id: 1,
      title: "Bitcoin: Do Zero ao Avançado",
      progress: 65,
      totalLessons: 24,
      completedLessons: 16,
      image: "₿",
      category: "Fundamentos"
    },
    {
      id: 2,
      title: "Introdução ao Ethereum",
      progress: 30,
      totalLessons: 18,
      completedLessons: 5,
      image: "Ξ",
      category: "Blockchain"
    },
    {
      id: 3,
      title: "DeFi: Finanças Descentralizadas",
      progress: 10,
      totalLessons: 20,
      completedLessons: 2,
      image: "🏦",
      category: "DeFi"
    }
  ];

  // Mock data for recent activity
  const recentActivity = [
    {
      id: 1,
      type: "lesson",
      title: "Completou: O que é Bitcoin?",
      time: "Há 2 horas",
      icon: CheckCircle2
    },
    {
      id: 2,
      type: "wallet",
      title: "Carteira MetaMask conectada",
      time: "Há 1 dia",
      icon: Wallet
    },
    {
      id: 3,
      type: "achievement",
      title: "Conquista: Primeiro Login",
      time: "Há 3 dias",
      icon: Trophy
    },
    {
      id: 4,
      type: "lesson",
      title: "Iniciou: Como funciona a Blockchain",
      time: "Há 5 dias",
      icon: Play
    }
  ];

  const stats = [
    {
      label: "Cursos Iniciados",
      value: "3",
      icon: BookOpen,
      color: "text-primary"
    },
    {
      label: "Aulas Completadas",
      value: "23",
      icon: CheckCircle2,
      color: "text-crypto-success"
    },
    {
      label: "Horas de Estudo",
      value: "12h",
      icon: Clock,
      color: "text-accent"
    },
    {
      label: "Conquistas",
      value: "5",
      icon: Trophy,
      color: "text-crypto-gold"
    }
  ];

  const copyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    toast({
      title: "Endereço copiado!",
      description: "O endereço foi copiado para a área de transferência.",
    });
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            Olá, {user.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Continue sua jornada no mundo das criptomoedas.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-secondary ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Courses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Courses in Progress */}
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Cursos em Andamento
                  </CardTitle>
                  <CardDescription>Continue de onde parou</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  Ver todos
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {coursesInProgress.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-xl">
                        {course.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            {course.category}
                          </Badge>
                        </div>
                        <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {course.completedLessons} de {course.totalLessons} aulas
                        </p>
                        <div className="flex items-center gap-3">
                          <Progress value={course.progress} className="flex-1 h-2" />
                          <span className="text-sm font-medium text-primary">
                            {course.progress}%
                          </span>
                        </div>
                      </div>
                      <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {coursesInProgress.length === 0 && (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Você ainda não iniciou nenhum curso.
                    </p>
                    <Button className="gradient-primary">
                      Explorar Cursos
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Connected Wallets */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-accent" />
                  Carteiras Conectadas
                </CardTitle>
                <CardDescription>
                  Gerencie suas carteiras vinculadas à conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {walletAddress && (
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-crypto-ethereum/20 flex items-center justify-center">
                          <span className="text-lg">🦊</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">MetaMask</span>
                            <Badge variant="outline" className="text-xs text-crypto-success border-crypto-success/50">
                              Ativa
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground font-mono">
                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {balance && (
                          <Badge variant="secondary" className="font-mono">
                            {parseFloat(balance).toFixed(4)} ETH
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyAddress(walletAddress)}
                        >
                          {copiedAddress === walletAddress ? (
                            <CheckCircle2 className="h-4 w-4 text-crypto-success" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(`https://etherscan.io/address/${walletAddress}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {savedWallets.filter(w => w.wallet_address !== walletAddress).map((wallet) => (
                  <div key={wallet.id} className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-lg">🦊</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium capitalize">{wallet.wallet_type}</span>
                            {wallet.is_primary && (
                              <Badge variant="outline" className="text-xs">
                                Principal
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-mono">
                            {wallet.wallet_address.slice(0, 6)}...{wallet.wallet_address.slice(-4)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyAddress(wallet.wallet_address)}
                      >
                        {copiedAddress === wallet.wallet_address ? (
                          <CheckCircle2 className="h-4 w-4 text-crypto-success" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}

                {!walletAddress && savedWallets.length === 0 && (
                  <div className="text-center py-8">
                    <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Nenhuma carteira conectada ainda.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Use o botão "Connect Wallet" no menu para vincular sua carteira.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Activity & Quick Stats */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <activity.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Goals */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Meta Semanal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Aulas completadas</span>
                      <span className="font-medium">3/5</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Tempo de estudo</span>
                      <span className="font-medium">2h/4h</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    Complete suas metas para ganhar conquistas!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Action */}
            <Card className="gradient-primary text-primary-foreground">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-80" />
                <h3 className="font-semibold mb-2">Continue Aprendendo</h3>
                <p className="text-sm opacity-80 mb-4">
                  Você está a 2 aulas de completar "Bitcoin: Do Zero ao Avançado"
                </p>
                <Button variant="secondary" className="w-full">
                  Continuar Curso
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
