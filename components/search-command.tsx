"use client";

import { useState, useEffect } from "react";
import { Command, File, WandSparkles, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import { useSearch } from "@/hooks/use-search";
import { auth, db } from "@/db/firebase/config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Document } from "@/models/types";
import { useAllDocuments } from "@/hooks/use-documents-by-user";
import { useAllFlashcardDecks } from "@/hooks/use-flashcard-deck-by-user";
import { useAllQuizzes } from "@/hooks/use-quizzes-by-user";

export const SearchCommand = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const {
    documents,
    isLoading: isDocumentsLoading,
    error: documentsError,
  } = useAllDocuments();
  const {
    flashcardDecks,
    isLoading: isLoadingFlashcardDecks,
    error: flashcardDeckError,
  } = useAllFlashcardDecks();
  const {
    quizzes,
    isLoading: isLoadingQuizzes,
    error: quizzesError,
  } = useAllQuizzes();

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const onSelect = (path: string, documentId: string | undefined) => {
    if (!documentId) return;
    router.push(`/${path}/${documentId}`);
    onClose();
  };

  if (!isMounted) return null;

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <CommandInput placeholder="Search notes..." />
      <CommandList>
        <CommandEmpty>No results found</CommandEmpty>
        {documents.length !== 0 && (
          <CommandGroup heading="Notes">
            {documents.map((document) => (
              <CommandItem
                key={document.id}
                value={`${document.id}-${document.title}`}
                title={document.title}
                onSelect={() => onSelect("documents", document.id)}
                className="cursor-pointer text-muted-foreground"
              >
                <File className="mr-2 h-4 w-4" />
                <span>{document.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {flashcardDecks.length !== 0 && (
          <>
            <CommandSeparator className="mb-1" />
            <CommandGroup heading="Flashcards">
              {flashcardDecks.map((deck) => (
                <CommandItem
                  key={deck.id}
                  value={`${deck.id}-${deck.title}`}
                  title={document.title}
                  onSelect={() => onSelect("flashcards", deck.id)}
                  className="cursor-pointer text-muted-foreground"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  <span>{deck.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
        {quizzes.length !== 0 && (
          <>
            <CommandSeparator className="mb-1" />
            <CommandGroup heading="Quizzes">
              {quizzes.map((quiz) => (
                <CommandItem
                  key={quiz.id}
                  value={`${quiz.id}-${quiz.title}`}
                  title={quiz.title}
                  onSelect={() => onSelect("quiz", quiz.id)}
                  className="cursor-pointer text-muted-foreground"
                >
                  <WandSparkles className="mr-2 h-4 w-4" />
                  <span>{quiz.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};
