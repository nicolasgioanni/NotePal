"use client";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/use-search";
import { Search } from "lucide-react";

interface SearchButtonProps {
  variant?: "ghost" | "default" | "secondary" | "outline";
}

export const SearchButton = ({ variant }: SearchButtonProps) => {
  const search = useSearch();

  return (
    <Button
      size="hug"
      variant={variant || "ghost"}
      className="justify-start py-1.5 px-1.5 text-muted-foreground hover:text-primary/80 transition group"
      onClick={search.onOpen}
    >
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-x-1.5 truncate">
          <Search className="w-4 h-4 shrink-0" />
          <span className="truncate">Search</span>
        </div>
        <kbd className="group-hover:opacity-0 ml-2 transition pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>
          <span className="text-xs">K</span>
        </kbd>
      </div>
    </Button>
  );
};
