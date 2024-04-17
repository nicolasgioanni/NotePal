"use client";

import { useState, useEffect } from "react";
import { Command, File } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { useSearch } from "@/hooks/use-search";
import { auth, db } from "@/firebase/config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Document } from "@/models/document";

export const SearchCommand = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    if (loading || !user) return;

    // Query for documents
    const docQuery = query(
      collection(db, "documents"),
      where("userId", "==", user.uid)
    );

    const unsubscribeDocuments = onSnapshot(docQuery, (querySnapshot) => {
      const loadedDocuments = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Document)
      );
      setDocuments(loadedDocuments);
    });

    return () => {
      unsubscribeDocuments();
    };
  }, [user, loading]);

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

  const onSelect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
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
        <CommandGroup heading="Documents">
          {documents.map((document) => (
            <CommandItem
              key={document.id}
              value={`${document.id}-${document.title}`}
              title={document.title}
              onSelect={onSelect}
            >
              <File className="mr-2 h-4 w-4" />
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
