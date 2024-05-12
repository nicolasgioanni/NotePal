"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Document } from "@/models/types";
import { useEffect, useRef, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/db/firebase/config";
import { updateDocument } from "@/db/firebase/document";
import { Skeleton } from "@/components/ui/skeleton";

interface TitleProps {
  initialData: Document;
}

export const Title = ({ initialData }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(initialData.title);
  }, [initialData]);

  const setDocumentTitle = async (title: string) => {
    if (!initialData.id) return;
    if (title.trim() === "") title = "Untitled";
    setTitle(title);

    await updateDocument(initialData.id, { title: title }).catch((error) => {
      console.error("Error updating document title: ", error);
      setTitle(initialData.title);
    });
  };

  const enableInput = () => {
    setIsEditing(true);
    setTimeout(() => {
      setTitle(initialData.title);
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setDocumentTitle(title);
    setIsEditing(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  return (
    <>
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className="h-8 px-1.5 py-1 text-base focus-visible:ring-transparent w-full"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="hug"
          className="font-medium py-1 px-1.5 text-base max-w-full"
        >
          <span className="truncate">{title}</span>
        </Button>
      )}
    </>
  );
};
