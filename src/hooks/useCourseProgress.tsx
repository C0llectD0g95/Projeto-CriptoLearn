import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "@/hooks/use-toast";

export function useCourseProgress() {
  const { user } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);
  const [lastAccessedLesson, setLastAccessedLesson] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load progress from database
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setCompletedLessons([]);
        setCompletedQuizzes([]);
        setLastAccessedLesson(null);
        setLoading(false);
        return;
      }

      try {
        // Load lesson progress
        const { data: lessonData, error: lessonError } = await supabase
          .from("user_progress")
          .select("lesson_id, completed, last_accessed_at")
          .eq("user_id", user.id)
          .order("last_accessed_at", { ascending: false });

        if (lessonError) throw lessonError;

        if (lessonData) {
          const completed = lessonData
            .filter((item) => item.completed)
            .map((item) => item.lesson_id);
          setCompletedLessons(completed);

          if (lessonData.length > 0) {
            setLastAccessedLesson(lessonData[0].lesson_id);
          }
        }

        // Load quiz progress
        const { data: quizData, error: quizError } = await supabase
          .from("quiz_progress")
          .select("quiz_id, passed")
          .eq("user_id", user.id);

        if (quizError) throw quizError;

        if (quizData) {
          const passedQuizzes = quizData
            .filter((item) => item.passed)
            .map((item) => item.quiz_id);
          setCompletedQuizzes(passedQuizzes);
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user]);

  // Mark lesson as completed/uncompleted
  const toggleLessonComplete = useCallback(
    async (lessonId: string) => {
      if (!user) return;

      const isCompleted = completedLessons.includes(lessonId);
      const newCompleted = isCompleted
        ? completedLessons.filter((id) => id !== lessonId)
        : [...completedLessons, lessonId];

      setCompletedLessons(newCompleted);

      try {
        const { error } = await supabase
          .from("user_progress")
          .upsert(
            {
              user_id: user.id,
              lesson_id: lessonId,
              completed: !isCompleted,
              completed_at: !isCompleted ? new Date().toISOString() : null,
              last_accessed_at: new Date().toISOString(),
            },
            { onConflict: "user_id,lesson_id" }
          );

        if (error) throw error;
      } catch (error) {
        console.error("Error updating progress:", error);
        setCompletedLessons(completedLessons);
      }
    },
    [user, completedLessons]
  );

  // Update last accessed lesson
  const updateLastAccessed = useCallback(
    async (lessonId: string) => {
      if (!user) return;

      setLastAccessedLesson(lessonId);

      try {
        const { error } = await supabase
          .from("user_progress")
          .upsert(
            {
              user_id: user.id,
              lesson_id: lessonId,
              completed: completedLessons.includes(lessonId),
              last_accessed_at: new Date().toISOString(),
            },
            { onConflict: "user_id,lesson_id" }
          );

        if (error) throw error;
      } catch (error) {
        console.error("Error updating last accessed:", error);
      }
    },
    [user, completedLessons]
  );

  // Claim TEA reward for module 3 completion
  const claimModule3Reward = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const response = await supabase.functions.invoke('claim-tea-reward', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Error claiming TEA reward:', error);
      return null;
    }
  }, []);

  // Mark quiz as completed
  const completeQuiz = useCallback(
    async (quizId: string, passed: boolean, score: number) => {
      if (!user) return;

      if (passed && !completedQuizzes.includes(quizId)) {
        setCompletedQuizzes((prev) => [...prev, quizId]);
      }

      try {
        const { error } = await supabase
          .from("quiz_progress")
          .upsert(
            {
              user_id: user.id,
              quiz_id: quizId,
              passed,
              score,
              completed_at: new Date().toISOString(),
            },
            { onConflict: "user_id,quiz_id" }
          );

        if (error) throw error;

        // If module 3 quiz is passed, automatically claim TEA reward
        if (passed && quizId === "module-3") {
          const rewardResult = await claimModule3Reward();
          if (rewardResult?.success) {
            toast({
              title: "🎉 Parabéns! Você ganhou 100 TEA!",
              description: `Transação: ${rewardResult.txHash.slice(0, 10)}...${rewardResult.txHash.slice(-8)}`,
            });
          } else if (rewardResult?.error === 'Reward already claimed') {
            // Reward already claimed, no need to show error
          } else if (rewardResult?.error === 'No wallet connected. Please connect your wallet first.') {
            toast({
              title: "Conecte sua carteira",
              description: "Para receber seus 100 TEA, conecte sua carteira MetaMask.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error saving quiz progress:", error);
        if (passed) {
          setCompletedQuizzes((prev) => prev.filter((id) => id !== quizId));
        }
      }
    },
    [user, completedQuizzes, claimModule3Reward]
  );

  return {
    completedLessons,
    completedQuizzes,
    lastAccessedLesson,
    loading,
    toggleLessonComplete,
    updateLastAccessed,
    completeQuiz,
    isAuthenticated: !!user,
  };
}
