"use client";

import { useParams, redirect } from "next/navigation";
import { useFlashcardDeckById } from "@/hooks/use-flashcard-deck-by-id";

const FlashcardDeckLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const { flashcardDeck, isLoading, error } = useFlashcardDeckById(
    params.flashcardDeckId as string
  );

  if (!flashcardDeck && !isLoading) {
    redirect("/dashboard");
  }

  return <main className="h-full">{children}</main>;
};

export default FlashcardDeckLayout;
