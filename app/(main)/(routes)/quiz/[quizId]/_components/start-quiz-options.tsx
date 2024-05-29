"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Quiz } from "@/models/types";
import { Loader2, Play, RotateCcw } from "lucide-react";
import {
  createPracticeQuiz,
  deletePracticeQuiz,
  getPracticeQuizByQuizId,
  resetPracticeQuiz,
} from "@/db/firebase/practice-quiz";
import { usePracticeQuizById } from "@/hooks/use-practice-quiz-by-id";
import { useRouter } from "next/navigation";

interface StartQuizOptionsProps {
  initialData: Quiz;
}

export const StartQuizOptions = ({ initialData }: StartQuizOptionsProps) => {
  const { id } = initialData;
  const { practiceQuiz, isLoading, error } = usePracticeQuizById(id!);
  const [resetting, setResetting] = useState(false);
  const router = useRouter();
  if (!id) return null;

  if (isLoading)
    return (
      <div className="flex justify-center h-10 items-center">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );

  const handleStart = async () => {
    router.push(`/quiz/practice/${id}`);
  };

  const handleRestart = async () => {
    if (!practiceQuiz) return;
    setResetting(true);
    await resetPracticeQuiz(id);
    router.push(`/quiz/practice/${id}`);
  };

  return (
    <>
      <Button
        variant="outline"
        className="flex-1"
        onClick={handleStart}
        disabled={resetting}
      >
        <Play className="w-4 h-4 mr-2" />
        {practiceQuiz ? "Resume" : "Start"} quiz
      </Button>
      {practiceQuiz && (
        <Button
          variant="outline"
          className="w-[107px]"
          onClick={() => handleRestart()}
          disabled={resetting}
        >
          {resetting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </>
          )}
        </Button>
      )}
    </>
  );
};
