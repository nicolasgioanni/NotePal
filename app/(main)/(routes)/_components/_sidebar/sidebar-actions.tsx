"use client";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/use-search";
import { Home, Search } from "lucide-react";
import Link from "next/link";
import { AddButton } from "./add-button";
import { SearchButton } from "../search-button";

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
      <SearchButton />
      <AddButton isCollapsed={isCollapsed} />
    </div>
  );
};
