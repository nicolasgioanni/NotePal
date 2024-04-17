"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Document } from "@/models/document";
import { useEffect, useRef, useState } from "react";
import {
  doc,
  DocumentReference,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";

interface TitleProps {
  docId: string;
}

export const Title = ({ docId }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [prevTitle, setPrevTitle] = useState("");
  const spanRef = useRef<HTMLSpanElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [document, setDocument] = useState<Document | null>(null);

  useEffect(() => {
    if (docId) {
      const docRef = doc(db, "documents", docId as string);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setDocument(docSnap.data() as Document);
          setPrevTitle(docSnap.data().title);
        } else {
          console.log("Document does not exist");
        }
      });

      return () => unsubscribe(); // Cleanup the listener when the component unmounts or the documentId changes
    }
  }, [docId]);

  const setDocumentTitle = async (title: string) => {
    updateDoc(doc(db, "documents", docId), { title: title }).catch((error) => {
      console.error("Error updating document title: ", error);
    });
  };

  const enableInput = () => {
    if (!document) return;
    setPrevTitle(document?.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    if (!document?.title.trim()) {
      updateDoc(doc(db, "documents", docId), { title: "Untitled" }).catch(
        (error) => {
          console.error("Error updating document title: ", error);
        }
      );
    }
    setIsEditing(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentTitle(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      disableInput();
    }
    if (e.key === "Escape") {
      updateDoc(doc(db, "documents", docId), { title: prevTitle }).catch(
        (error) => {
          console.error("Error updating document title: ", error);
        }
      );
      disableInput();
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
          value={document?.title}
          className="h-8 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-semibold h-auto p-1 px-1.5 text-base "
        >
          <span className="truncate">{document?.title || "Untitled"}</span>
        </Button>
      )}
    </>
  );
};
