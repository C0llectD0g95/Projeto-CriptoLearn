import { useState } from "react";
import { Award, Download, Share2, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface CourseCertificateProps {
  courseName: string;
  completedModules: number;
  totalModules: number;
}

export default function CourseCertificate({
  courseName,
  completedModules,
  totalModules,
}: CourseCertificateProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const completionDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handleShare = async () => {
    const text = `🎓 Acabei de concluir o curso "${courseName}" na TEA! #crypto #blockchain #web3`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Certificado de Conclusão",
          text: text,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="border-crypto-gold/30 bg-gradient-to-br from-crypto-gold/10 via-card/50 to-crypto-purple/10 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZkNzAwIiBzdHJva2Utb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30" />
      
      <CardContent className="relative p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-crypto-gold/20 mb-4">
            <Award className="h-10 w-10 text-crypto-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Parabéns! 🎉
          </h2>
          <p className="text-muted-foreground text-lg">
            Você concluiu o curso com sucesso!
          </p>
        </div>

        {/* Certificate Body */}
        <div className="bg-card/80 border border-border/50 rounded-xl p-6 md:p-8 mb-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
              Certificado de Conclusão
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-crypto-purple mb-4">
              {courseName}
            </h3>
            
            <div className="w-16 h-0.5 bg-crypto-gold mx-auto mb-4" />
            
            <p className="text-foreground mb-2">
              Este certificado é concedido a
            </p>
            <p className="text-xl font-semibold text-foreground mb-4">
              {user?.email || "Estudante"}
            </p>
            
            <p className="text-muted-foreground text-sm">
              Por completar todos os {totalModules} módulos e quizzes do curso
            </p>
            
            <div className="mt-6 pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Data de conclusão: <span className="text-foreground font-medium">{completionDate}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-card/50 rounded-lg border border-border/30">
            <CheckCircle className="h-6 w-6 text-crypto-green mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{totalModules}</p>
            <p className="text-xs text-muted-foreground">Módulos</p>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border border-border/30">
            <CheckCircle className="h-6 w-6 text-crypto-green mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{totalModules}</p>
            <p className="text-xs text-muted-foreground">Quizzes</p>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border border-border/30">
            <Award className="h-6 w-6 text-crypto-gold mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">100%</p>
            <p className="text-xs text-muted-foreground">Progresso</p>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg border border-border/30">
            <Award className="h-6 w-6 text-crypto-purple mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">1</p>
            <p className="text-xs text-muted-foreground">Certificado</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleShare}
            className="bg-crypto-purple hover:bg-crypto-purple/80"
          >
            <Share2 className="h-4 w-4 mr-2" />
            {copied ? "Link copiado!" : "Compartilhar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
