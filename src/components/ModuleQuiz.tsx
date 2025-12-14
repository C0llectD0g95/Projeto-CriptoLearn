import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Trophy, RotateCcw, Coins, Loader2, AlertCircle, Wallet, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  moduleId: string;
  title: string;
  questions: QuizQuestion[];
}

interface ModuleQuizProps {
  quiz: Quiz;
  onComplete: (passed: boolean, score: number) => void;
  isCompleted: boolean;
}

interface EligibilityStatus {
  canClaim: boolean;
  reason: string | null;
  alreadyClaimed: boolean;
  walletConnected: boolean;
  walletAddress: string | null;
  walletAge: number | null;
  walletTooNew: boolean;
  walletAlreadyUsed: boolean;
}

export default function ModuleQuiz({ quiz, onComplete, isCompleted }: ModuleQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isClaimingReward, setIsClaimingReward] = useState(false);
  const [eligibility, setEligibility] = useState<EligibilityStatus | null>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  const question = quiz.questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;
  const totalQuestions = quiz.questions.length;
  const correctAnswers = answers.filter(
    (answer, index) => answer === quiz.questions[index].correctAnswer
  ).length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  const passed = score >= 70;

  // Check eligibility when viewing completed module 3 quiz
  useEffect(() => {
    if (isCompleted && quiz.moduleId === "module-3") {
      checkEligibility();
    }
  }, [isCompleted, quiz.moduleId]);

  const checkEligibility = async () => {
    setCheckingEligibility(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setEligibility({
          canClaim: false,
          reason: "Faça login para verificar sua elegibilidade.",
          alreadyClaimed: false,
          walletConnected: false,
          walletAddress: null,
          walletAge: null,
          walletTooNew: false,
          walletAlreadyUsed: false,
        });
        return;
      }

      // Check if user already claimed
      const { data: existingClaim } = await supabase
        .from('tea_rewards')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('reward_type', 'module_3_completion')
        .maybeSingle();

      if (existingClaim) {
        setEligibility({
          canClaim: false,
          reason: "Você já resgatou esta recompensa.",
          alreadyClaimed: true,
          walletConnected: true,
          walletAddress: null,
          walletAge: null,
          walletTooNew: false,
          walletAlreadyUsed: false,
        });
        return;
      }

      // Check wallet
      const { data: wallets } = await supabase
        .from('wallets')
        .select('wallet_address, connected_at, is_primary')
        .eq('user_id', session.user.id)
        .order('is_primary', { ascending: false })
        .order('connected_at', { ascending: true });

      if (!wallets || wallets.length === 0) {
        setEligibility({
          canClaim: false,
          reason: "Conecte sua carteira MetaMask para resgatar.",
          alreadyClaimed: false,
          walletConnected: false,
          walletAddress: null,
          walletAge: null,
          walletTooNew: false,
          walletAlreadyUsed: false,
        });
        return;
      }

      const wallet = wallets[0];
      const walletCreatedAt = new Date(wallet.connected_at);
      const now = new Date();
      const daysSinceCreation = (now.getTime() - walletCreatedAt.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceCreation < 7) {
        const daysRemaining = Math.ceil(7 - daysSinceCreation);
        setEligibility({
          canClaim: false,
          reason: `Sua carteira precisa ter pelo menos 7 dias. Faltam ${daysRemaining} dia(s).`,
          alreadyClaimed: false,
          walletConnected: true,
          walletAddress: wallet.wallet_address,
          walletAge: Math.floor(daysSinceCreation),
          walletTooNew: true,
          walletAlreadyUsed: false,
        });
        return;
      }

      // Check if wallet already claimed
      const { data: walletClaim } = await supabase
        .from('tea_rewards')
        .select('id')
        .eq('wallet_address', wallet.wallet_address)
        .eq('reward_type', 'module_3_completion')
        .maybeSingle();

      if (walletClaim) {
        setEligibility({
          canClaim: false,
          reason: "Este endereço de carteira já foi usado para resgatar esta recompensa.",
          alreadyClaimed: false,
          walletConnected: true,
          walletAddress: wallet.wallet_address,
          walletAge: Math.floor(daysSinceCreation),
          walletTooNew: false,
          walletAlreadyUsed: true,
        });
        return;
      }

      // User is eligible
      setEligibility({
        canClaim: true,
        reason: null,
        alreadyClaimed: false,
        walletConnected: true,
        walletAddress: wallet.wallet_address,
        walletAge: Math.floor(daysSinceCreation),
        walletTooNew: false,
        walletAlreadyUsed: false,
      });
    } catch (error) {
      console.error('Error checking eligibility:', error);
      setEligibility({
        canClaim: false,
        reason: "Erro ao verificar elegibilidade. Tente novamente.",
        alreadyClaimed: false,
        walletConnected: false,
        walletAddress: null,
        walletAge: null,
        walletTooNew: false,
        walletAlreadyUsed: false,
      });
    } finally {
      setCheckingEligibility(false);
    }
  };

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleConfirm = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selectedAnswer!];
    setAnswers(newAnswers);

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
      const finalCorrect = newAnswers.filter(
        (answer, index) => answer === quiz.questions[index].correctAnswer
      ).length;
      const finalScore = Math.round((finalCorrect / totalQuestions) * 100);
      onComplete(finalScore >= 70, finalScore);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers([]);
    setQuizFinished(false);
  };

  const handleClaimReward = async () => {
    setIsClaimingReward(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "❌ Não autenticado",
          description: "Faça login para resgatar sua recompensa.",
          variant: "destructive",
        });
        return;
      }

      const response = await supabase.functions.invoke('claim-tea-reward', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const result = response.data;
      
      if (result?.success) {
        toast({
          title: "🎉 Parabéns! Você ganhou 100 TEA!",
          description: `Transação: ${result.txHash.slice(0, 10)}...${result.txHash.slice(-8)}`,
        });
        // Update eligibility status
        setEligibility(prev => prev ? { ...prev, canClaim: false, alreadyClaimed: true, reason: "Recompensa resgatada com sucesso!" } : null);
      } else if (result?.error) {
        toast({
          title: "❌ Erro ao resgatar TEA",
          description: result.error,
          variant: "destructive",
        });
        // Refresh eligibility
        checkEligibility();
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast({
        title: "❌ Erro ao resgatar TEA",
        description: "Ocorreu um erro ao tentar resgatar sua recompensa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsClaimingReward(false);
    }
  };

  // Render eligibility status
  const renderEligibilityStatus = () => {
    if (checkingEligibility) {
      return (
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Verificando elegibilidade...</span>
        </div>
      );
    }

    if (!eligibility) return null;

    if (eligibility.alreadyClaimed) {
      return (
        <div className="bg-crypto-green/10 border border-crypto-green/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-crypto-green">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Recompensa já resgatada!</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Você já recebeu seus 100 TEA por completar este módulo.
          </p>
        </div>
      );
    }

    if (!eligibility.walletConnected) {
      return (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-destructive">
            <Wallet className="h-5 w-5" />
            <span className="font-medium">Carteira não conectada</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {eligibility.reason}
          </p>
        </div>
      );
    }

    if (eligibility.walletTooNew) {
      return (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-amber-500">
            <Clock className="h-5 w-5" />
            <span className="font-medium">Carteira muito recente</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {eligibility.reason}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Carteira conectada há {eligibility.walletAge} dia(s).
          </p>
        </div>
      );
    }

    if (eligibility.walletAlreadyUsed) {
      return (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Carteira já utilizada</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {eligibility.reason}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Endereço: {eligibility.walletAddress?.slice(0, 6)}...{eligibility.walletAddress?.slice(-4)}
          </p>
        </div>
      );
    }

    if (eligibility.canClaim) {
      return (
        <div className="bg-crypto-green/10 border border-crypto-green/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-crypto-green">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Você está elegível!</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Carteira: {eligibility.walletAddress?.slice(0, 6)}...{eligibility.walletAddress?.slice(-4)} ({eligibility.walletAge} dias)
          </p>
        </div>
      );
    }

    return (
      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Não elegível</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {eligibility.reason}
        </p>
      </div>
    );
  };

  // Show completed state for module 3 with claim button
  if (isCompleted && quiz.moduleId === "module-3") {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <div className="p-4 rounded-full bg-crypto-green/20">
              <Trophy className="h-12 w-12 text-crypto-green" />
            </div>
          </div>
          <CardTitle className="text-2xl">Quiz Concluído!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-center">
            Você já completou este quiz com sucesso!
          </p>
          
          <div className="bg-crypto-gold/10 border border-crypto-gold/30 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Coins className="h-5 w-5 text-crypto-gold" />
              <span className="font-semibold text-crypto-gold">Recompensa: 100 TEA</span>
            </div>
            
            {/* Eligibility Status */}
            {renderEligibilityStatus()}
            
            {/* Claim Button */}
            {eligibility?.canClaim && (
              <div className="mt-4 text-center">
                <Button
                  onClick={handleClaimReward}
                  disabled={isClaimingReward}
                  className="bg-crypto-gold hover:bg-crypto-gold/80 text-black"
                >
                  {isClaimingReward ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Resgatando...
                    </>
                  ) : (
                    <>
                      <Coins className="h-4 w-4 mr-2" />
                      Resgatar 100 TEA
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {/* Refresh button for non-eligible users */}
            {eligibility && !eligibility.canClaim && !eligibility.alreadyClaimed && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={checkEligibility}
                  disabled={checkingEligibility}
                >
                  {checkingEligibility ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Verificar novamente
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (quizFinished) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {passed ? (
              <div className="p-4 rounded-full bg-crypto-green/20">
                <Trophy className="h-12 w-12 text-crypto-green" />
              </div>
            ) : (
              <div className="p-4 rounded-full bg-destructive/20">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {passed ? "Parabéns!" : "Tente novamente"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div>
            <p className="text-4xl font-bold text-foreground mb-2">{score}%</p>
            <p className="text-muted-foreground">
              {correctAnswers} de {totalQuestions} questões corretas
            </p>
          </div>
          
          <p className="text-muted-foreground">
            {passed
              ? "Você completou o quiz com sucesso! Continue para o próximo módulo."
              : "Você precisa de pelo menos 70% para passar. Revise o conteúdo e tente novamente."}
          </p>

          {!passed && (
            <Button onClick={handleRetry} className="bg-crypto-purple hover:bg-crypto-purple/80">
              <RotateCcw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-crypto-purple border-crypto-purple/30">
            {quiz.title}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Questão {currentQuestion + 1} de {totalQuestions}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-crypto-purple to-crypto-blue transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <CardTitle className="text-xl leading-relaxed">{question.question}</CardTitle>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              disabled={showResult}
              className={cn(
                "w-full p-4 rounded-lg border text-left transition-all",
                selectedAnswer === index && !showResult
                  ? "border-crypto-purple bg-crypto-purple/10"
                  : "border-border hover:border-muted-foreground/50",
                showResult && index === question.correctAnswer
                  ? "border-crypto-green bg-crypto-green/10"
                  : "",
                showResult && selectedAnswer === index && !isCorrect
                  ? "border-destructive bg-destructive/10"
                  : ""
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                    selectedAnswer === index && !showResult
                      ? "bg-crypto-purple text-white"
                      : "bg-muted text-muted-foreground",
                    showResult && index === question.correctAnswer
                      ? "bg-crypto-green text-white"
                      : "",
                    showResult && selectedAnswer === index && !isCorrect
                      ? "bg-destructive text-white"
                      : ""
                  )}
                >
                  {showResult && index === question.correctAnswer ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : showResult && selectedAnswer === index && !isCorrect ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </span>
                <span className="text-foreground">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {showResult && (
          <div
            className={cn(
              "p-4 rounded-lg",
              isCorrect ? "bg-crypto-green/10 border border-crypto-green/30" : "bg-destructive/10 border border-destructive/30"
            )}
          >
            <p className={cn("font-medium mb-1", isCorrect ? "text-crypto-green" : "text-destructive")}>
              {isCorrect ? "Correto!" : "Incorreto"}
            </p>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </div>
        )}

        <div className="flex justify-end">
          {!showResult ? (
            <Button
              onClick={handleConfirm}
              disabled={selectedAnswer === null}
              className="bg-crypto-purple hover:bg-crypto-purple/80"
            >
              Confirmar
            </Button>
          ) : (
            <Button onClick={handleNext} className="bg-crypto-purple hover:bg-crypto-purple/80">
              {currentQuestion < totalQuestions - 1 ? "Próxima Questão" : "Ver Resultado"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
