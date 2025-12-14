import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet, ExternalLink, Copy, LogOut, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MetaMaskMobileModal from "./MetaMaskMobileModal";

const WalletButton = () => {
  const { walletAddress, balance, isConnecting, hasMetaMask, isMobile, connectWallet, disconnectWallet } = useWallet();
  const [showMobileModal, setShowMobileModal] = useState(false);

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: "Endereço copiado!",
        description: "O endereço da carteira foi copiado para a área de transferência.",
      });
    }
  };

  const openEtherscan = () => {
    if (walletAddress) {
      window.open(`https://etherscan.io/address/${walletAddress}`, "_blank");
    }
  };

  const handleMobileConnect = () => {
    setShowMobileModal(true);
  };

  const handleMobileContinue = () => {
    connectWallet();
  };

  // On mobile without MetaMask, show button that opens modal with instructions
  if (!hasMetaMask && isMobile) {
    return (
      <>
        <Button onClick={handleMobileConnect} className="gradient-primary">
          <Wallet className="h-4 w-4 mr-2" />
          Abrir MetaMask
        </Button>
        <MetaMaskMobileModal
          open={showMobileModal}
          onOpenChange={setShowMobileModal}
          onContinue={handleMobileContinue}
        />
      </>
    );
  }

  if (!hasMetaMask) {
    return (
      <Button variant="outline" asChild>
        <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">
          <Wallet className="h-4 w-4 mr-2" />
          Instalar MetaMask
        </a>
      </Button>
    );
  }

  if (walletAddress) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <div className="h-2 w-2 rounded-full bg-crypto-success" />
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">Carteira Conectada</p>
              {balance && (
                <p className="text-xs text-muted-foreground">
                  {parseFloat(balance).toFixed(4)} ETH
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyAddress}>
            <Copy className="h-4 w-4 mr-2" />
            Copiar endereço
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openEtherscan}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver no Etherscan
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnectWallet} className="text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Desconectar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={connectWallet} disabled={isConnecting} className="gradient-primary">
      {isConnecting ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Wallet className="h-4 w-4 mr-2" />
      )}
      Conectar Carteira
    </Button>
  );
};

export default WalletButton;
