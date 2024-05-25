"use client";
import { MobileSidebarButton } from "@/components/mobile-sidebar-button";
import { Title } from "./_components/title";
import { Body } from "./_components/body";
import { useParams, useRouter } from "next/navigation";
import { Loader2, RotateCcw, X } from "lucide-react";
import { resetPracticeQuiz } from "@/db/firebase/practice-quiz";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useQuizById } from "@/hooks/use-quiz-by-id";
import { ErrorPage } from "@/components/error-page";

export default function QuizPracticePage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId as string;
  const resetBodyStateRef = useRef<() => void>();
  const [resettingQuiz, setResettingQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { quiz, isLoading, error } = useQuizById(quizId);

  const handleRestart = async () => {
    setResettingQuiz(true);
    await toast.promise(resetPracticeQuiz(quizId), {
      loading: "Restarting...",
      success: "Quiz restarted!",
      error: "Failed to restart quiz",
    });
    setResettingQuiz(false);
    if (resetBodyStateRef.current) {
      resetBodyStateRef.current();
    }
    setCurrentQuestionIndex(0);
  };

  if (isLoading || resettingQuiz) {
    return (
      <div className="h-2/3 flex justify-center items-center min-h-96">
        <Loader2 className="animate-spin w-10 h-10 text-muted-foreground shrink-0" />
      </div>
    );
  }

  if (!quiz || error) {
    return <ErrorPage />;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between gap-x-4">
        <div className="flex gap-x-4 w-full">
          <MobileSidebarButton />
          <Title title={quiz.title} />
        </div>
        <div className="flex gap-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleRestart}
                disabled={currentQuestionIndex === 0}
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Restart</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => router.push(`/quiz/${quizId}`)}
              >
                <X className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Exit</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Body
        quizId={quizId}
        onReset={(resetFn) => (resetBodyStateRef.current = resetFn)}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
      />
    </div>
  );
}
