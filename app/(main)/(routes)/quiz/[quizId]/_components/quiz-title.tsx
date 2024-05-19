"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { updateQuiz } from "@/db/firebase/quiz";
import { Quiz } from "@/models/types";
import { useEffect, useRef, useState } from "react";

interface QuizTitleProps {
  initialData?: Quiz;
}

export const QuizTitle = ({ initialData }: QuizTitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
    }
  }, [initialData]);

  const setQuizTitle = async (title: string) => {
    if (!initialData || !initialData.id) return;
    if (title.trim() === "") title = "Untitled";
    setTitle(title);

    await updateQuiz(initialData.id, { title: title }).catch((error) => {
      console.error("Error updating quiz title: ", error);
      setTitle(initialData.title);
    });
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
    setQuizTitle(title);
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

  if (!initialData) return <QuizTitle.Skeleton />;

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
          <span className="text-wrap text-left">{title}</span>
        </Button>
      )}
    </div>
  );
};

QuizTitle.Skeleton = function QuizTitleSkeleton() {
  return (
    <div className="text-3xl font-semibold">
      <Skeleton className="h-11 w-40 rounded-lg" />
    </div>
  );
};
