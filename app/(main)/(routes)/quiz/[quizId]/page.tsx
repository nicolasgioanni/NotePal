"use client";
import { useParams } from "next/navigation";

import { QuizTitle } from "./_components/quiz-title";
import { QuizBody } from "./_components/quiz-body";
import { MobileSidebarButton } from "@/components/mobile-sidebar-button";
import { useQuizById } from "@/hooks/use-quiz-by-id";

export default function QuizPage() {
  const params = useParams();
  const { quiz, isLoading, error } = useQuizById(params.quizId as string);

  if (error) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col min-h-full max-w-4xl w-full">
      <div className="flex gap-x-4 items-center">
        <MobileSidebarButton />
        <QuizTitle initialData={quiz} />
      </div>

      <QuizBody initialData={quiz} />
    </div>
  );
}
