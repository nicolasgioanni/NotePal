"use client";
import { useRouter } from "next/navigation";
import { DocumentItem } from "../../_components/document-item";
import { useAllDocuments } from "@/hooks/use-documents-by-user";
import { useAllFlashcardDecks } from "@/hooks/use-flashcard-deck-by-user";
import { useAllQuizzes } from "@/hooks/use-quizzes-by-user";
import { FlashcardDeckItem } from "../../_components/flashcard-deck-item";
import { QuizItem } from "../../_components/quiz-item";

export const DashboardDocList = () => {
  const router = useRouter();
  const {
    documents,
    isLoading: notesLoading,
    error: notesError,
  } = useAllDocuments();
  const {
    flashcardDecks,
    isLoading: flashcardsLoading,
    error: flashcardsError,
  } = useAllFlashcardDecks();
  const {
    quizzes,
    isLoading: quizzesLoading,
    error: quizzesError,
  } = useAllQuizzes();

  const onRedirect = (path: string, id?: string) => {
    if (!id) return;

    router.push(`/${path}/${id}`);
  };

  const isLoading = notesLoading || flashcardsLoading || quizzesLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-2">
        <DocumentItem.Skeleton level={0} />
        <DocumentItem.Skeleton level={0} />
        <DocumentItem.Skeleton level={0} />
        <DocumentItem.Skeleton level={0} />
      </div>
    );
  }

  if (
    documents.length === 0 &&
    flashcardDecks.length === 0 &&
    quizzes.length === 0
  ) {
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
      {quizzes.map((quiz) => (
        <QuizItem
          key={quiz.id}
          id={quiz.id!}
          label={quiz.title}
          onClick={() => onRedirect("quiz", quiz.id)}
        />
      ))}
    </div>
  );
};
