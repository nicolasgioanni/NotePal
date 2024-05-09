"use client";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/use-search";
import { Home, Search } from "lucide-react";
import Link from "next/link";
import { AddButton } from "./add-button";

interface SidebarActionsProps {
  isCollapsed: boolean;
}

export const SidebarActions = ({ isCollapsed }: SidebarActionsProps) => {
  const search = useSearch();

  if (isCollapsed) return null;

  return (
    <div className="flex flex-col gap-y-1">
      <Button
        size="hug"
        variant="ghost"
        className="justify-start py-1.5 px-1.5 text-muted-foreground hover:text-primary/80 transition"
        asChild
      >
        <Link href="/dashboard">
          <div className="flex items-center gap-x-1.5 truncate">
            <Home className="w-4 h-4 shrink-0" />
            <span className="truncate">Home</span>
          </div>
        </Link>
      </Button>
      <Button
        size="hug"
        variant="ghost"
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
      <AddButton isCollapsed={isCollapsed} />
    </div>
  );
};
