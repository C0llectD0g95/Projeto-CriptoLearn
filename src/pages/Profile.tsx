import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Wallet, 
  Mail, 
  Calendar,
  Copy,
  CheckCircle2,
  ExternalLink,
  Shield,
  Bell,
  Trash2
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, loading } = useAuth();
  const { walletAddress, balance, savedWallets } = useWallet();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  const copyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    toast({
      title: "Endereço copiado!",
      description: "O endereço foi copiado para a área de transferência.",
    });
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
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
      
      <main className="container py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e configurações da conta.
          </p>
        </div>

        <div className="space-y-6">
          {/* User Info Card */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Seus dados básicos de conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {getInitials(user.email || "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {user.user_metadata?.display_name || user.email?.split('@')[0]}
                  </h3>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input value={user.email || ""} disabled className="bg-secondary" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Membro desde
                  </Label>
                  <Input 
                    value={user.created_at ? formatDate(user.created_at) : "—"} 
                    disabled 
                    className="bg-secondary" 
                  />
                </div>
              </div>
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

          {/* Account Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                Configurações da Conta
              </CardTitle>
              <CardDescription>
                Segurança e preferências
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Notificações por Email</p>
                    <p className="text-sm text-muted-foreground">
                      Receba atualizações sobre novos cursos e conquistas
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Segurança</p>
                    <p className="text-sm text-muted-foreground">
                      Alterar senha e configurações de segurança
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Gerenciar
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-3">
                  <Trash2 className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">Excluir Conta</p>
                    <p className="text-sm text-muted-foreground">
                      Remover permanentemente sua conta e todos os dados
                    </p>
                  </div>
                </div>
                <Button variant="destructive" size="sm">
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;