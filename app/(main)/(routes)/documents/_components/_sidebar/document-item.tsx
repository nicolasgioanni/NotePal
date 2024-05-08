"use client";

import { cn } from "@/lib/utils";
import { File, MoreHorizontal, TextCursorInput, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DeleteAlertDialog } from "../delete-alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteDocument } from "@/db/firebase/document";

interface DocumentItemProps {
  id: string;
  label: string;
  active?: boolean;
  level?: number;
  onClick?: () => void;
}

export const DocumentItem = ({
  id,
  label,
  active,
  level,
  onClick,
}: DocumentItemProps) => {
  const Icon = File;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    toast.promise(deleteDocument(id), {
      loading: "Deleting document...",
      success: "Document deleted!",
      error: "Failed to delete document.",
    });
  };

  return (
    <>
      <div
        onClick={onClick}
        role="button"
        style={{ marginLeft: level ? `${level * 14}px` : "0px" }}
        className={cn(
          "group py-1.5 px-1.5 flex items-center hover:bg-accent font-medium text-muted-foreground rounded-md text-sm transition",
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
                className="opacity-0 group-hover:opacity-100 transition hover:bg-foreground/15 p-[1px] rounded-sm"
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

DocumentItem.Skeleton = function DocumentItemSkeleton({
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
