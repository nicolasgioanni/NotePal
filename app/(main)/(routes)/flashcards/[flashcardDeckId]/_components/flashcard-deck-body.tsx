import { Skeleton } from "@/components/ui/skeleton";
import { FlashcardDeck } from "@/models/types";
import { FlashcardCarousel } from "./flashcard-carousel";
import { FlashcardList } from "./flashcard-list";
import { AddFlashcardButton } from "./add-flashcard-button";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddFlashcardDialog } from "./add-flashcard-dialog";
import { Separator } from "@/components/ui/separator";

interface FlashcardDeckBodyProps {
  initialData?: FlashcardDeck;
}

export const FlashcardDeckBody = ({ initialData }: FlashcardDeckBodyProps) => {
  if (!initialData)
    return (
      <div className="h-2/3 flex justify-center items-center min-h-96">
        <Loader2 className="animate-spin w-10 h-10 text-muted-foreground shrink-0" />
      </div>
    );

  if (initialData.flashcards.length === 0)
    return (
      <div className="h-2/3 flex flex-col gap-y-10 justify-center items-center min-h-[490px] ">
        <div className="relative w-2/5 aspect-video mt-20">
          <div className="absolute inset-auto bg-background size-full rounded-xl border origin-bottom-left -rotate-12 shadow-md" />
          <div className="absolute inset-auto bg-background size-full rounded-xl border origin-bottom-right rotate-12 shadow-md" />
          <div className="absolute inset-auto bg-background size-full rounded-xl border shadow-md">
            <div className="size-full p-4 sm:p-5 md:p-6 lg:p-8">
              <div className="flex flex-col size-full gap-y-2 sm:gap-y-3 md:gap-y-4">
                <div className="h-[8%] w-5/6 bg-muted rounded-full" />
                <div className="h-[8%] w-1/2 bg-muted rounded-full" />
                <div className="h-[8%] w-2/3 bg-muted rounded-full" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col text-center gap-y-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">
            Flashcard deck is empty
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg ">
            Looks like this deck is empty, <br />
            click on the button to add the first one.
          </p>
          <div className="flex justify-center mt-2">
            <AddFlashcardDialog
              initialData={initialData}
              button={<Button>Add flashcard</Button>}
            />
          </div>
        </div>
      </div>
    );

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
