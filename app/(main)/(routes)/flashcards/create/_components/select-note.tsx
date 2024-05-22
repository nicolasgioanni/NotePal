import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useAllDocuments } from "@/hooks/use-documents-by-user";
import { useSearch } from "@/hooks/use-search";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Document } from "@/models/types";
import { File } from "lucide-react";

interface SearchCommandProps {
  onSelect: (document: Document) => void;
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const SelectNoteCommand = ({
  onSelect,
  isOpen,
  setOpen,
}: SearchCommandProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const { documents, isLoading, error } = useAllDocuments();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={setOpen}
    >
      <CommandInput placeholder="Search notes..." />
      <CommandList>
        <CommandEmpty>No results found</CommandEmpty>
        <CommandGroup heading="Select a note">
          {documents.map((document) => (
            <CommandItem
              key={document.id}
              value={`${document.id}-${document.title}`}
              title={document.title}
              onSelect={() => {
                onSelect(document);
                setOpen(false);
              }}
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
