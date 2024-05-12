"use client";
import { useParams } from "next/navigation";
import { useFlashcardDeckById } from "@/hooks/use-flashcard-deck-by-id";
import { FlashcardDeckTitle } from "./_components/flashcard-deck-title";
import { FlashcardDeckBody } from "./_components/flashcard-deck-body";

export default function FlashcardDeckPage() {
  const params = useParams();
  const { flashcardDeck, isLoading, error } = useFlashcardDeckById(
    params.flashcardDeckId as string
  );

  if (error) return <div>Something went wrong</div>;

  return (
    <div className="flex justify-center">
      <div className="h-full max-w-4xl w-full">
        <FlashcardDeckTitle initialData={flashcardDeck} />
        <FlashcardDeckBody initialData={flashcardDeck} />
      </div>
    </div>
  );
}
