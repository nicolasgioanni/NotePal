import { Skeleton } from "@/components/ui/skeleton";
import { FlashcardDeck } from "@/models/types";
import { FlashcardCarousel } from "./flashcard-carousel";
import { FlashcardList } from "./flashcard-list";
import { AddFlashcardButton } from "./add-flashcard-button";

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
          <AddFlashcardButton initialData={initialData} />
        </div>
        <FlashcardList initialData={initialData} />
      </div>
    </div>
  );
};
