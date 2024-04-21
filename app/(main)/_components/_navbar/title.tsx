"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Document } from "@/models/document";
import { useEffect, useRef, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

interface TitleProps {
  docId: string;
}

export const Title = ({ docId }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [document, setDocument] = useState<Document>();

  useEffect(() => {
    if (docId) {
      const docRef = doc(db, "documents", docId as string);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setDocument(docSnap.data() as Document);
          setTitle(docSnap.data().title);
        } else {
          console.log("Document does not exist");
          setTitle("Untitled");
        }
      });

      return () => unsubscribe(); // Cleanup the listener when the component unmounts or the documentId changes
    }
  }, [docId]);

  const setDocumentTitle = async (title: string) => {
    if (title.trim() === "") title = "Untitled";
    updateDoc(doc(db, "documents", docId), { title: title }).catch((error) => {
      console.error("Error updating document title: ", error);
    });
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      disableInput();
    }
    if (e.key === "Escape") {
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
          className="h-8 px-2 focus-visible:ring-transparent w-full"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-medium h-auto p-1 px-1.5 text-base max-w-full"
        >
          <span className="truncate">{title}</span>
        </Button>
      )}
    </>
  );
};
