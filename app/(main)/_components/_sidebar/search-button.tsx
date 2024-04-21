import { Search } from "lucide-react";

interface SearchButtonProps {
  onClick: () => void;
}

export const SearchButton = ({ onClick }: SearchButtonProps) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-accent/50 py-2 px-2 flex items-center hover:bg-accent font-medium text-muted-foreground rounded-md text-sm transition"
    >
      <Search className="h-4 w-4 mr-2 shrink-0" />
      <span className="truncate">Search</span>
      <kbd className="group-hover:opacity-0 transition ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
        <span className="text-xs">⌘</span>K
      </kbd>
    </div>
  );
};
