import { Title } from "./_components/title";
import { Body } from "./_components/body";
import { Suspense } from "react";
import { NavActions } from "./_components/nav-actions";

type QuizResultsPageParams = {
  quizId: string;
};

export default function QuizResultsPage({
  params,
}: {
  params: QuizResultsPageParams;
}) {
  const { quizId } = params;

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-3xl font-semibold">Quiz Results</h1>
          <Suspense fallback={<div>Loading...</div>}>
            <Title quizId={quizId} />
          </Suspense>
        </div>
        <NavActions quizId={quizId} />
      </div>
      <Body quizId={quizId} />
    </div>
  );
}
