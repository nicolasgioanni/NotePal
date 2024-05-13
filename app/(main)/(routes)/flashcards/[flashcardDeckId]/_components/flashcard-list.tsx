import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FlashcardDeck } from "@/models/types";
import { Pencil, Plus, Trash } from "lucide-react";

interface FlashcardDeckListProps {
  initialData?: FlashcardDeck;
}

export const FlashcardList = ({ initialData }: FlashcardDeckListProps) => {
  if (!initialData) return <FlashcardList.Skeleton />;

  const { flashcards } = initialData;

  return (
    <div className="flex flex-col gap-y-4">
      {flashcards.map((flashcard) => (
        <div
          key={flashcard.id}
          className="p-6 border rounded-lg flex shadow-md group"
        >
          <div className="flex w-full">
            <h3 className="text-sm sm:text-base md:text-lg font-medium w-1/2 text-primary/80 text-wrap">
              {flashcard.front}
            </h3>
            <Separator
              orientation="vertical"
              className="mx-4"
            />
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground w-1/2 content ">
              {flashcard.back}
            </p>
            <div className="flex items-start gap-x-1 ml-1">
              <Button
                variant="ghost"
                size="hug"
                className="p-1.5 text-muted-foreground hover:text-primary/80 md:opacity-0 group-hover:opacity-100 transition"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

FlashcardList.Skeleton = function FlashcardListSkeleton() {
  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <Skeleton className="h-[78px] w-full" />
      <Skeleton className="h-[78px] w-full" />
      <Skeleton className="h-[78px] w-full" />
    </div>
  );
};
