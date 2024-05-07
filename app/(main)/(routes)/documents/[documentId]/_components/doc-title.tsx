"use client";

import { useState, useRef, useEffect } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/db/firebase/config";
import { Document } from "@/models/types";
import TextareaAutosize from "react-textarea-autosize";
import { updateDocument } from "@/db/firebase/document";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentById } from "@/hooks/use-document-by-id";

interface DocTitleProps {
  docId: string;
}

export const DocTitle = ({ docId }: DocTitleProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { document, isLoading, error } = useDocumentById(docId);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (document) {
      setTitle(document.title);
    }
  }, [document]);

  const setDocumentTitle = async (title: string) => {
    if (!document || !document.id) return;
    if (title.trim() === "") title = "Untitled";
    setTitle(title);

    await updateDocument(document.id, { title: title }).catch((error) => {
      console.error("Error updating document title: ", error);
      setTitle(document.title);
    });
  };

  const enableInput = () => {
    if (!document) return;
    setIsEditing(true);
    setTimeout(() => {
      setTitle(document.title);
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setDocumentTitle(title);
    setIsEditing(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      disableInput();
    }
    if (e.key === "Escape") {
      if (!document) return;
      e.preventDefault();
      setTitle(document.title == "" ? "Untitled" : document.title);
      setIsEditing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="px-8 sm:px-12 pt-12">
        <DocTitle.Skeleton />
      </div>
    );
  }

  return (
    <div className="text-[40px] font-extrabold flex justify-start px-8 sm:px-12 pt-12 min-h-[92px]">
      {isEditing ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={title}
          onChange={onChange}
          className="bg-transparent break-words outline-none resize-none w-full"
        />
      ) : (
        <div
          onClick={enableInput}
          className="cursor-pointer content"
        >
          {title}
        </div>
      )}
    </div>
  );
};

DocTitle.Skeleton = function DocTitleSkeleton() {
  return <Skeleton className="w-1/2 h-[60px] rounded-2xl" />;
};
