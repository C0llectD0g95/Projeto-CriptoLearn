import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Smartphone, ExternalLink, ArrowRight, Wallet } from "lucide-react";

interface MetaMaskMobileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export default function MetaMaskMobileModal({
  open,
  onOpenChange,
  onContinue,
}: MetaMaskMobileModalProps) {
  const handleContinue = () => {
    onContinue();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 p-3 rounded-full bg-crypto-purple/20">
            <Smartphone className="h-8 w-8 text-crypto-purple" />
          </div>
          <DialogTitle className="text-center text-xl">
            Conectar Carteira no Mobile
          </DialogTitle>
          <DialogDescription className="text-center">
            Para conectar sua carteira MetaMask em dispositivos móveis, siga os passos abaixo:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-4 items-start">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-crypto-purple text-white text-sm font-bold flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-medium text-foreground">Instale o app MetaMask</p>
              <p className="text-sm text-muted-foreground">
                Baixe o aplicativo MetaMask na App Store (iOS) ou Google Play (Android).
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-crypto-purple text-white text-sm font-bold flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-medium text-foreground">Crie ou importe sua carteira</p>
              <p className="text-sm text-muted-foreground">
                Abra o app e crie uma nova carteira ou importe uma existente usando sua frase de recuperação.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-crypto-purple text-white text-sm font-bold flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-medium text-foreground">Abra este site no MetaMask</p>
              <p className="text-sm text-muted-foreground">
                Ao clicar em "Continuar", você será redirecionado para o navegador interno do MetaMask.
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="h-4 w-4 text-crypto-green" />
              <span>A conexão será feita automaticamente no navegador do MetaMask.</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleContinue}
            className="w-full bg-crypto-purple hover:bg-crypto-purple/80"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Continuar para MetaMask
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Cancelar
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Não tem o MetaMask?{" "}
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-crypto-purple hover:underline"
          >
            Baixe aqui
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
}
