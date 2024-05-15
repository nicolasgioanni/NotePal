"use client";
import { useParams } from "next/navigation";
import { useFlashcardDeckById } from "@/hooks/use-flashcard-deck-by-id";
import { FlashcardDeckTitle } from "./_components/flashcard-deck-title";
import { FlashcardDeckBody } from "./_components/flashcard-deck-body";
import { MobileSidebarButton } from "@/components/mobile-sidebar-button";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function FlashcardDeckPage() {
  const params = useParams();
  const { flashcardDeck, isLoading, error } = useFlashcardDeckById(
    params.flashcardDeckId as string
  );
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (error) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col min-h-full max-w-4xl w-full">
      <div className="flex gap-x-4 items-center">
        <MobileSidebarButton />
        <FlashcardDeckTitle initialData={flashcardDeck} />
      </div>

      <FlashcardDeckBody initialData={flashcardDeck} />
    </div>
  );
}
