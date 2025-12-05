import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface DeleteAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  userEmail: string;
}

export const DeleteAccountModal = ({
  open,
  onOpenChange,
  onConfirm,
  userEmail,
}: DeleteAccountModalProps) => {
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const isConfirmValid = confirmText === "EXCLUIR";

  const handleConfirm = async () => {
    if (!isConfirmValid) return;
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setConfirmText("");
    }
    onOpenChange(open);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Excluir Conta Permanentemente
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Esta ação é <strong>irreversível</strong>. Todos os seus dados serão 
              permanentemente excluídos, incluindo:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Seu perfil e informações pessoais</li>
              <li>Carteiras conectadas</li>
              <li>Progresso nos cursos</li>
              <li>Todas as configurações da conta</li>
            </ul>
            <p className="text-sm">
              Conta a ser excluída: <strong>{userEmail}</strong>
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-2">
          <Label htmlFor="confirm-delete">
            Digite <strong>EXCLUIR</strong> para confirmar
          </Label>
          <Input
            id="confirm-delete"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
            placeholder="EXCLUIR"
            className="font-mono"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isConfirmValid || deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Excluir Conta
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
