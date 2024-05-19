"use client";

import { useParams, redirect } from "next/navigation";
import { useQuizById } from "@/hooks/use-quiz-by-id";

const QuizLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const { quiz, isLoading, error } = useQuizById(params.quizId as string);

  if (!quiz && !isLoading) {
    redirect("/dashboard");
  }

  return <main className="min-h-full flex justify-center">{children}</main>;
};

export default QuizLayout;
