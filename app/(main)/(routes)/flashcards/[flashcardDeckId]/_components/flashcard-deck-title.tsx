import { FlashcardDeck } from "@/models/types";

interface FlashcardDeckTitleProps {
  initialData: FlashcardDeck;
}

export const FlashcardDeckTitle = ({
  initialData,
}: FlashcardDeckTitleProps) => {
  return <div className="text-3xl font-semibold">{initialData.title}</div>;
};
