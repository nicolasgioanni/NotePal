"use client";

import { useState, useRef, useEffect } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Document } from "@/models/types";
import TextareaAutosize from "react-textarea-autosize";
import { updateDocument } from "@/firebase/firestoreService";

interface DocTitleProps {
  initialData: Document;
}

export const DocTitle = ({ initialData }: DocTitleProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialData.title);

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

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
