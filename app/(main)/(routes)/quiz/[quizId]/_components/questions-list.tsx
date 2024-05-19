import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Quiz } from "@/models/types";
import { EditQuestionButton } from "./edit-question-button";

interface QuestionListProps {
  initialData: Quiz;
}

export const QuestionList = ({ initialData }: QuestionListProps) => {
  if (!initialData.id) return <QuestionList.Skeleton />;

  const { questions, id } = initialData;

  return (
    <div className="flex flex-col gap-y-4">
      {questions.map((question) => (
        <div
          key={question.id}
          className="p-6 border rounded-lg flex shadow-md group"
        >
          <div className="flex w-full">
            <h3 className="text-sm sm:text-base md:text-lg font-medium w-1/2 text-primary/80 text-wrap">
              {question.question}
            </h3>
            <Separator
              orientation="vertical"
              className="mx-4"
            />
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground w-1/2 content ">
              {question.answer}
            </p>
            <div className="flex items-start gap-x-1 ml-1 ">
              <EditQuestionButton
                quizId={id}
                question={question}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

QuestionList.Skeleton = function QuestionListSkeleton() {
  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <Skeleton className="h-[78px] w-full" />
      <Skeleton className="h-[78px] w-full" />
      <Skeleton className="h-[78px] w-full" />
    </div>
  );
};
