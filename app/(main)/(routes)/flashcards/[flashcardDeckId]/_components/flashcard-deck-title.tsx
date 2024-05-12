"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { updateFlashcardDeck } from "@/db/firebase/flashcards";
import { FlashcardDeck } from "@/models/types";
import { useEffect, useRef, useState } from "react";

interface FlashcardDeckTitleProps {
  initialData?: FlashcardDeck;
}

export const FlashcardDeckTitle = ({
  initialData,
}: FlashcardDeckTitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
    }
  }, [initialData]);

  const setFlashcardDeckTitle = async (title: string) => {
    if (!initialData || !initialData.id) return;
    if (title.trim() === "") title = "Untitled";
    setTitle(title);

    await updateFlashcardDeck(initialData.id, { title: title }).catch(
      (error) => {
        console.error("Error updating flashcard deck title: ", error);
        setTitle(initialData.title);
      }
    );
  };

  const enableInput = () => {
    if (!initialData) return;
    setIsEditing(true);
    setTimeout(() => {
      setTitle(initialData.title);
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setFlashcardDeckTitle(title);
    setIsEditing(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!initialData) return;

    if (e.key === "Enter") {
      e.preventDefault();
      disableInput();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setTitle(initialData.title == "" ? "Untitled" : initialData.title);
      setIsEditing(false);
    }
  };

  if (!initialData) return <FlashcardDeckTitle.Skeleton />;

  return (
    <div>
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className="focus-visible:ring-transparent h-11 text-3xl font-semibold px-1.5 py-1"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="hug"
          className="px-1.5 py-1 text-3xl font-semibold"
        >
          <span className="truncate">{title}</span>
        </Button>
      )}
    </div>
  );
};

FlashcardDeckTitle.Skeleton = function FlashcardDeckTitleSkeleton() {
  return (
    <div className="text-3xl font-semibold">
      <Skeleton className="h-11 w-40 rounded-lg" />
    </div>
  );
};
