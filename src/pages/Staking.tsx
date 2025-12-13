import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStaking } from "@/hooks/useStaking";
import { useWallet } from "@/hooks/useWallet";
import { 
  Coins, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Gift, 
  Loader2, 
  Wallet,
  Percent,
  TrendingUp,
  RefreshCw
} from "lucide-react";

const Staking = () => {
  const { walletAddress } = useWallet();
  const { 
    stakedBalance, 
    earnedRewards, 
    teaBalance, 
    totalStaked,
    rewardRate,
    allowance,
    isLoading, 
    approve,
    stake, 
    withdraw, 
    claimRewards,
    exit,
    refreshData
  } = useStaking();
  
  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"stake" | "withdraw">("stake");

  const formatNumber = (value: string, decimals: number = 4) => {
    const num = parseFloat(value);
    if (num === 0) return "0";
    if (num < 0.0001) return "< 0.0001";
    return num.toLocaleString("pt-BR", { maximumFractionDigits: decimals });
  };

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
    
    const amountNum = parseFloat(stakeAmount);
    const allowanceNum = parseFloat(allowance);
    
    if (allowanceNum < amountNum) {
      const success = await approve(stakeAmount);
      if (!success) return;
    }
    
    const success = await stake(stakeAmount);
    if (success) {
      setStakeAmount("");
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return;
    const success = await withdraw(withdrawAmount);
    if (success) {
      setWithdrawAmount("");
    }
  };

  const handleMaxStake = () => {
    setStakeAmount(teaBalance);
  };

  const handleMaxWithdraw = () => {
    setWithdrawAmount(stakedBalance);
  };

  const needsApproval = parseFloat(stakeAmount || "0") > parseFloat(allowance);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-display font-bold">Staking de TEA</h1>
            </div>
            <p className="text-muted-foreground">
              Faça stake dos seus tokens TEA e ganhe recompensas passivas.
            </p>
            {walletAddress && (
              <p className="text-xs text-muted-foreground mt-2 font-mono bg-muted/50 px-2 py-1 rounded inline-block">
                Carteira: {walletAddress}
              </p>
            )}
          </div>

          {!walletAddress ? (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Conecte sua Carteira</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Conecte sua carteira MetaMask para fazer stake dos seus tokens TEA.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Stats Cards */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Total em Stake (Pool)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatNumber(totalStaked, 2)} TEA</p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Taxa de Recompensa Anual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-500">{formatNumber(rewardRate, 2)} TEA/ano</p>
                </CardContent>
              </Card>

              {/* User Balance Cards */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Seu Saldo Disponível
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatNumber(teaBalance)} TEA</p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Seu Stake Atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">{formatNumber(stakedBalance)} TEA</p>
                </CardContent>
              </Card>

              {/* Rewards Card */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm md:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-primary" />
                        Recompensas Acumuladas
                      </CardTitle>
                      <CardDescription>
                        Recompensas pendentes para resgate
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={refreshData}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-green-500">
                      {formatNumber(earnedRewards)} TEA
                    </p>
                    <Button 
                      onClick={claimRewards}
                      disabled={isLoading || parseFloat(earnedRewards) === 0}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Gift className="h-4 w-4 mr-2" />
                          Resgatar Recompensas
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stake/Withdraw Card */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm md:col-span-2">
                <CardHeader>
                  <div className="flex gap-2">
                    <Button
                      variant={activeTab === "stake" ? "default" : "outline"}
                      onClick={() => setActiveTab("stake")}
                      className="flex-1"
                    >
                      <ArrowUpCircle className="h-4 w-4 mr-2" />
                      Stake
                    </Button>
                    <Button
                      variant={activeTab === "withdraw" ? "default" : "outline"}
                      onClick={() => setActiveTab("withdraw")}
                      className="flex-1"
                    >
                      <ArrowDownCircle className="h-4 w-4 mr-2" />
                      Retirar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {activeTab === "stake" ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Quantidade para Stake
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Input
                              type="number"
                              placeholder="0.0"
                              value={stakeAmount}
                              onChange={(e) => setStakeAmount(e.target.value)}
                              className="pr-16"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs"
                              onClick={handleMaxStake}
                            >
                              MAX
                            </Button>
                          </div>
                          <Button 
                            onClick={handleStake}
                            disabled={isLoading || !stakeAmount || parseFloat(stakeAmount) <= 0}
                            className="min-w-[140px]"
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : needsApproval ? (
                              "Aprovar & Stake"
                            ) : (
                              "Fazer Stake"
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Disponível: {formatNumber(teaBalance)} TEA
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Quantidade para Retirar
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Input
                              type="number"
                              placeholder="0.0"
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(e.target.value)}
                              className="pr-16"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs"
                              onClick={handleMaxWithdraw}
                            >
                              MAX
                            </Button>
                          </div>
                          <Button 
                            onClick={handleWithdraw}
                            disabled={isLoading || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
                            className="min-w-[140px]"
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Retirar"
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Em stake: {formatNumber(stakedBalance)} TEA
                        </p>
                      </div>

                      <div className="pt-4 border-t border-border/50">
                        <Button 
                          variant="outline" 
                          onClick={exit}
                          disabled={isLoading || parseFloat(stakedBalance) === 0}
                          className="w-full"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Retirar Tudo + Recompensas"
                          )}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center mt-2">
                          Retira todo o stake e recompensas de uma vez
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Staking;
