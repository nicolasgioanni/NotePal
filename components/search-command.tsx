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
import { auth, db } from "@/db/firebase/config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Document } from "@/models/types";
import { useAllDocuments } from "@/hooks/use-documents-by-user";

export const SearchCommand = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { documents, isLoading, error } = useAllDocuments();

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

  const onSelect = (documentId: string | undefined) => {
    if (!documentId) return;
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
        <CommandGroup heading="Notes">
          {documents.map((document) => (
            <CommandItem
              key={document.id}
              value={`${document.id}-${document.title}`}
              title={document.title}
              onSelect={() => onSelect(document.id)}
              className="cursor-pointer text-muted-foreground"
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
