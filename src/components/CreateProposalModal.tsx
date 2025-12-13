import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { z } from "zod";

const proposalSchema = z.object({
  title: z.string()
    .trim()
    .min(10, "O título deve ter pelo menos 10 caracteres")
    .max(100, "O título deve ter no máximo 100 caracteres"),
  description: z.string()
    .trim()
    .min(50, "A descrição deve ter pelo menos 50 caracteres")
    .max(2000, "A descrição deve ter no máximo 2000 caracteres"),
});

interface CreateProposalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string, description: string) => Promise<boolean>;
  isLoading: boolean;
  votingPower: string;
  proposalThreshold: string;
}

const CreateProposalModal = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  votingPower,
  proposalThreshold,
}: CreateProposalModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const votingPowerNum = parseFloat(votingPower);
  const thresholdNum = parseFloat(proposalThreshold);
  const hasEnoughPower = votingPowerNum >= thresholdNum;

  const handleSubmit = async () => {
    setErrors({});

    const result = proposalSchema.safeParse({ title, description });
    if (!result.success) {
      const fieldErrors: { title?: string; description?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "title") fieldErrors.title = err.message;
        if (err.path[0] === "description") fieldErrors.description = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const success = await onSubmit(title.trim(), description.trim());
    if (success) {
      setTitle("");
      setDescription("");
      onOpenChange(false);
    }
  };

  const formatNumber = (value: string) => {
    const num = parseFloat(value);
    if (num === 0) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
    if (num >= 1000) return (num / 1000).toFixed(2) + "K";
    return num.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Proposta</DialogTitle>
          <DialogDescription>
            Crie uma proposta de governança para votação da comunidade.
          </DialogDescription>
        </DialogHeader>

        {!hasEnoughPower && (
          <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-destructive">Poder de voto insuficiente</p>
              <p className="text-muted-foreground mt-1">
                Você precisa de pelo menos <strong>{formatNumber(proposalThreshold)} TEA</strong> em 
                poder de voto para criar uma proposta. Seu poder atual: <strong>{formatNumber(votingPower)} TEA</strong>.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Proposta</Label>
            <Input
              id="title"
              placeholder="Ex: Aumentar recompensas de staking"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              disabled={!hasEnoughPower || isLoading}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
            <p className="text-xs text-muted-foreground">{title.length}/100 caracteres</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva sua proposta em detalhes. Inclua a motivação, benefícios esperados e como ela será implementada..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              rows={6}
              disabled={!hasEnoughPower || isLoading}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
            <p className="text-xs text-muted-foreground">{description.length}/2000 caracteres</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!hasEnoughPower || isLoading || !title.trim() || !description.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              "Criar Proposta"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProposalModal;
