import { Skeleton } from "@/components/ui/skeleton";
import { FlashcardDeck } from "@/models/types";
import { FlashcardCarousel } from "./flashcard-carousel";
import { FlashcardList } from "./flashcard-list";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FlashcardDeckBodyProps {
  initialData?: FlashcardDeck;
}

export const FlashcardDeckBody = ({ initialData }: FlashcardDeckBodyProps) => {
  return (
    <div className="flex flex-col mt-6 gap-y-8">
      <FlashcardCarousel initialData={initialData} />
      <div className="flex flex-col gap-y-6">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold text-primary/80">
            Flashcards in this deck
          </h1>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="hug"
                className="p-1 text-muted-foreground hover:text-primary/80"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Add a flashcard</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <FlashcardList initialData={initialData} />
      </div>
    </div>
  );
};
