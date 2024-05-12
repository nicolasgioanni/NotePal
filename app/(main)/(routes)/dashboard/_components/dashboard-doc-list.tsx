"use client";
import { useRouter } from "next/navigation";
import { DocumentItem } from "../../_components/document-item";
import { useAllDocuments } from "@/hooks/use-documents-by-user";
import { useAllFlashcardDecks } from "@/hooks/use-flashcard-deck-by-user";
import { FlashcardDeckItem } from "../../_components/flashcard-deck-item";

export const DashboardDocList = () => {
  const router = useRouter();
  const {
    documents,
    isLoading: documentLoading,
    error: documentError,
  } = useAllDocuments();
  const {
    flashcardDecks,
    isLoading: isLoadingFlashcardDecks,
    error: flashcardDeckError,
  } = useAllFlashcardDecks();

  const onRedirect = (path: string, documentId?: string) => {
    if (!documentId) return;

    router.push(`/${path}/${documentId}`);
  };

  if (documentLoading || isLoadingFlashcardDecks) {
    return (
      <div className="flex flex-col gap-y-2">
        <DocumentItem.Skeleton level={0} />
        <DocumentItem.Skeleton level={0} />
        <DocumentItem.Skeleton level={0} />
        <DocumentItem.Skeleton level={0} />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-sm font-medium text-muted-foreground/65">
        You don&apos;t have any documents yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      {documents.map((doc) => (
        <DocumentItem
          key={doc.id}
          id={doc.id!}
          label={doc.title}
          onClick={() => onRedirect("documents", doc.id)}
        />
      ))}
      {flashcardDecks.map((deck) => (
        <FlashcardDeckItem
          key={deck.id}
          id={deck.id!}
          label={deck.title}
          onClick={() => onRedirect("flashcards", deck.id)}
        />
      ))}
    </div>
  );
};
