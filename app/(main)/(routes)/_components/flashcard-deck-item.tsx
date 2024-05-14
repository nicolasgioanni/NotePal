"use client";

import { cn } from "@/lib/utils";
import {
  GalleryHorizontalEnd,
  MoreHorizontal,
  TextCursorInput,
  Trash,
  Zap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DeleteAlertDialog } from "./delete-alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteFlashcardDeck } from "@/db/firebase/flashcards";

interface FlashcardDeckItemProps {
  id: string;
  label: string;
  active?: boolean;
  level?: number;
  onClick?: () => void;
}

export const FlashcardDeckItem = ({
  id,
  label,
  active,
  level,
  onClick,
}: FlashcardDeckItemProps) => {
  const Icon = Zap;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    toast.promise(deleteFlashcardDeck(id), {
      loading: "Deleting flashcards...",
      success: "Flashcards deleted!",
      error: "Failed to delete flashcards.",
    });
  };

  return (
    <>
      <div
        onClick={onClick}
        role="button"
        style={{ marginLeft: level ? `${level * 14}px` : "0px" }}
        className={cn(
          "group py-1.5 px-1.5 flex items-center hover:bg-accent font-medium text-muted-foreground hover:text-primary/80 rounded-md text-sm transition",
          active && "bg-accent text-accent-foreground"
        )}
      >
        <Icon className="h-4 w-4 mr-2 shrink-0" />
        <span className="truncate">{label}</span>
        <div
          onClick={(e) => e.stopPropagation()}
          className="ml-auto flex items-center"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="hug"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition hover:bg-foreground/15 p-[1px] rounded-sm ml-0.5"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side="right"
              onCloseAutoFocus={(e) => e.preventDefault()}
              className="text-muted-foreground"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  <TextCursorInput className="mr-2 h-4 w-4" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer group/delete"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <div className="text-muted-foreground flex items-center group-hover/delete:text-red-600 transition">
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <DeleteAlertDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDelete}
      />
    </>
  );
};

FlashcardDeckItem.Skeleton = function FlashcardDeckItemSkeleton({
  level,
}: {
  level?: number;
}) {
  return (
    <div style={{ paddingLeft: level ? `${level * 12}px` : "0px" }}>
      <Skeleton className="h-8 w-full" />
    </div>
  );
};
