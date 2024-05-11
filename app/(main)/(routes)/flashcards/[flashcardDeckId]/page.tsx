"use client";
import { useParams } from "next/navigation";
import { useFlashcardDeckById } from "@/hooks/use-flashcard-deck-by-id";
import { FlashcardDeckTitle } from "./_components/flashcard-deck-title";

export default function FlashcardDeckPage() {
  const params = useParams();
  const { flashcardDeck, isLoading, error } = useFlashcardDeckById(
    params.flashcardDeckId as string
  );

  if (isLoading) return <div>Loading...</div>;

  if (error || flashcardDeck === undefined)
    return <div>Something went wrong</div>;

  return (
    <div>
      <FlashcardDeckTitle initialData={flashcardDeck} />
    </div>
  );
}
