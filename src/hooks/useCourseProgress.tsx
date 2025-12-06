import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface ProgressData {
  lessonId: string;
  completed: boolean;
  lastAccessedAt: string;
}

export function useCourseProgress() {
  const { user } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [lastAccessedLesson, setLastAccessedLesson] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load progress from database
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setCompletedLessons([]);
        setLastAccessedLesson(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_progress")
          .select("lesson_id, completed, last_accessed_at")
          .eq("user_id", user.id)
          .order("last_accessed_at", { ascending: false });

        if (error) throw error;

        if (data) {
          const completed = data
            .filter((item) => item.completed)
            .map((item) => item.lesson_id);
          setCompletedLessons(completed);

          // Get the most recently accessed lesson
          if (data.length > 0) {
            setLastAccessedLesson(data[0].lesson_id);
          }
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
        // Revert on error
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

  return {
    completedLessons,
    lastAccessedLesson,
    loading,
    toggleLessonComplete,
    updateLastAccessed,
    isAuthenticated: !!user,
  };
}
