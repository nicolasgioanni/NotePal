import { getQuizById } from "@/db/firebase/quiz";
import { Quiz } from "@/models/types";

interface TitleProps {
  quizId: string;
}

export const Title = async ({ quizId }: TitleProps) => {
  const quiz = await getQuizById(quizId);
  const quizData = JSON.parse(quiz) as Quiz;
  console.log(quizData);

  return (
    <h2 className="text-lg font-semibold text-muted-foreground">
      {quizData.title}
    </h2>
  );
};
