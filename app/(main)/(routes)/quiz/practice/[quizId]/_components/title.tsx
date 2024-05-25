import { Skeleton } from "@/components/ui/skeleton";
import { useQuizById } from "@/hooks/use-quiz-by-id";
import { Quiz } from "@/models/types";

interface TitleProps {
  title: string;
}

export const Title = ({ title }: TitleProps) => {
  return <h1 className="text-3xl font-semibold">{title}</h1>;
};
