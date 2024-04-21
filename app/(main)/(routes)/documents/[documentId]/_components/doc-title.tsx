"use client";

import { useState, useRef, useEffect } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Document } from "@/models/document";
import TextareaAutosize from "react-textarea-autosize";
import { Skeleton } from "@/components/ui/skeleton";

interface DocTitleProps {
  documentId: string;
}

export const DocTitle = ({ documentId }: DocTitleProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [document, setDocument] = useState<Document>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (documentId) {
      const docRef = doc(db, "documents", documentId);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setDocument(docSnap.data() as Document);
          setTitle(docSnap.data().title);
          setIsLoading(false);
        } else {
          console.log("Document does not exist");
        }
      });

      return () => unsubscribe(); // Cleanup the listener when the component unmounts or the documentId changes
    }
  }, [documentId]);

  const setDocumentTitle = async (title: string) => {
    if (title.trim() === "") title = "Untitled";
    updateDoc(doc(db, "documents", documentId), { title: title }).catch(
      (error) => {
        console.error("Error updating document title: ", error);
      }
    );
  };

  const enableInput = () => {
    setIsEditing(true);
    setTitle(document?.title || "");
    setTimeout(() => {
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
      disableInput();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  if (isLoading)
    return (
      <div className="px-8 sm:px-12 pt-12">
        <Skeleton className="h-[60px] w-1/2 rounded-3xl" />
      </div>
    );

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
