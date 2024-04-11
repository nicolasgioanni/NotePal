"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";

interface ItemProps {
  id?: string;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick: () => void;
  icon: LucideIcon;
}

export const Item = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  documentIcon,
  isSearch,
  level = 0,
  onExpand,
  expanded,
}: ItemProps) => {
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 8 + 8}px` : "8px" }}
      className={cn(
        "group min-h-[27px] py-2 pr-2 w-full flex items-center hover:bg-accent font-medium text-muted-foreground rounded-md text-sm",
        active && "bg-accent text-accent-foreground"
      )}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm mr-1"
          onClick={() => {}}
        >
          <ChevronIcon className="h-4 w-4 shrink-0" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-1 text-base">{documentIcon}</div>
      ) : (
        <Icon className="shrink-0 h-4 mr-1" />
      )}

      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="group-hover:opacity-0 ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
    </div>
  );
};
