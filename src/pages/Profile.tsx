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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Trash2,
  Pencil,
  Key,
  Loader2,
  Camera
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, loading, updateProfile, updateEmail, updatePassword, updateAvatar } = useAuth();
  const { walletAddress, balance, savedWallets } = useWallet();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Edit profile state
  const [editingProfile, setEditingProfile] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  
  // Edit email state
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  
  // Edit password state
  const [editingPassword, setEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  
  // Avatar upload state
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma imagem válida.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive"
      });
      return;
    }

    setUploadingAvatar(true);
    const { error } = await updateAvatar(file);
    setUploadingAvatar(false);

    if (error) {
      toast({
        title: "Erro ao atualizar foto",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Foto atualizada!",
        description: "Sua foto de perfil foi alterada com sucesso.",
      });
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      toast({
        title: "Erro",
        description: "O nome não pode estar vazio.",
        variant: "destructive"
      });
      return;
    }

    setSavingProfile(true);
    const { error } = await updateProfile(displayName.trim());
    setSavingProfile(false);

    if (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Perfil atualizado!",
        description: "Seu nome foi alterado com sucesso.",
      });
      setEditingProfile(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!newEmail.trim()) {
      toast({
        title: "Erro",
        description: "O email não pode estar vazio.",
        variant: "destructive"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast({
        title: "Erro",
        description: "Digite um email válido.",
        variant: "destructive"
      });
      return;
    }

    setSavingEmail(true);
    const { error } = await updateEmail(newEmail.trim());
    setSavingEmail(false);

    if (error) {
      toast({
        title: "Erro ao atualizar email",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Email de confirmação enviado!",
        description: "Verifique sua caixa de entrada para confirmar a alteração.",
      });
      setEditingEmail(false);
      setNewEmail("");
    }
  };

  const handleSavePassword = async () => {
    if (newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }

    setSavingPassword(true);
    const { error } = await updatePassword(newPassword);
    setSavingPassword(false);

    if (error) {
      toast({
        title: "Erro ao atualizar senha",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Senha atualizada!",
        description: "Sua senha foi alterada com sucesso.",
      });
      setEditingPassword(false);
      setNewPassword("");
      setConfirmPassword("");
    }
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
                <div className="relative group">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {getInitials(user.email || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {uploadingAvatar ? (
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    ) : (
                      <Camera className="h-6 w-6 text-white" />
                    )}
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">
                      {user.user_metadata?.display_name || user.email?.split('@')[0]}
                    </h3>
                    <Dialog open={editingProfile} onOpenChange={(open) => {
                      setEditingProfile(open);
                      if (open) setDisplayName(user.user_metadata?.display_name || "");
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Nome</DialogTitle>
                          <DialogDescription>
                            Altere o nome de exibição do seu perfil.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="displayName">Nome de exibição</Label>
                            <Input
                              id="displayName"
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              placeholder="Seu nome"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingProfile(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleSaveProfile} disabled={savingProfile}>
                            {savingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
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
                  <div className="flex gap-2">
                    <Input value={user.email || ""} disabled className="bg-secondary flex-1" />
                    <Dialog open={editingEmail} onOpenChange={(open) => {
                      setEditingEmail(open);
                      if (!open) setNewEmail("");
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Alterar Email</DialogTitle>
                          <DialogDescription>
                            Um email de confirmação será enviado para o novo endereço.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentEmail">Email atual</Label>
                            <Input
                              id="currentEmail"
                              value={user.email || ""}
                              disabled
                              className="bg-secondary"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newEmail">Novo email</Label>
                            <Input
                              id="newEmail"
                              type="email"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                              placeholder="novoemail@exemplo.com"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingEmail(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleSaveEmail} disabled={savingEmail}>
                            {savingEmail && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enviar Confirmação
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
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
                  <Key className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Alterar Senha</p>
                    <p className="text-sm text-muted-foreground">
                      Atualize sua senha de acesso
                    </p>
                  </div>
                </div>
                <Dialog open={editingPassword} onOpenChange={(open) => {
                  setEditingPassword(open);
                  if (!open) {
                    setNewPassword("");
                    setConfirmPassword("");
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Alterar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Alterar Senha</DialogTitle>
                      <DialogDescription>
                        Digite uma nova senha para sua conta.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Nova senha</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Mínimo 6 caracteres"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar senha</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repita a nova senha"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditingPassword(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSavePassword} disabled={savingPassword}>
                        {savingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Alterar Senha
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

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