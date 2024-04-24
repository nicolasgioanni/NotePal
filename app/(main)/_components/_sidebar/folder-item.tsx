"use client";

import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  FilePlus,
  FolderPlus,
  MoreHorizontal,
  Plus,
  TextCursorInput,
  Trash,
} from "lucide-react";
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
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { deleteFolder } from "@/firebase/firestoreService";
import { toast } from "sonner";
import { useAuthState } from "react-firebase-hooks/auth";
import { Document, Folder } from "@/models/types";
import { defaultEditorContent } from "@/lib/content";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface FolderItemProps {
  id: string;
  label: string;
  expanded: boolean;
  level?: number;
  onClick?: () => void;
}

export const FolderItem = ({
  id,
  label,
  expanded,
  level,
  onClick,
}: FolderItemProps) => {
  const [user, loading, error] = useAuthState(auth);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const router = useRouter();

  const Icon = expanded ? ChevronDown : ChevronRight;

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    toast.promise(deleteFolder(id), {
      loading: "Deleting folder...",
      success: "Folder deleted!",
      error: "Failed to delete folder.",
    });
  };

  const handleCreateFolder = () => {
    if (!user) return;

    const newFolder: Folder = {
      title: "Untitled",
      userId: user.uid,
      parentFolderId: id,
    };

    const docRef = doc(collection(db, "folders"));
    const promise = setDoc(docRef, newFolder).then(() => {
      if (!expanded) {
        onClick?.();
      }
    });

    toast.promise(promise, {
      loading: "Creating a new folder...",
      success: "Folder created!",
      error: "Failed to create a new folder.",
    });
  };

  const handleCreateDocument = () => {
    if (!user) return;

    const newDocument: Document = {
      title: "Untitled",
      userId: user.uid,
      content: defaultEditorContent,
      isPublished: false,
      parentFolderId: id,
    };

    const docRef = doc(collection(db, "documents"));
    const promise = setDoc(docRef, newDocument).then(() => {
      if (!expanded) {
        onClick?.();
      }
      router.push(`/documents/${docRef.id}`);
    });

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "Note created!",
      error: "Failed to create a new note.",
    });
  };

  return (
    <>
      <div
        onClick={onClick}
        role="button"
        style={{ marginLeft: level ? `${level * 14}px` : "0px" }}
        className={cn(
          "group py-1.5 px-2 flex items-center hover:bg-accent font-medium text-muted-foreground rounded-md text-sm transition"
        )}
      >
        <Icon className="h-4 w-4 mr-2 shrink-0" />
        <span className="truncate">{label}</span>
        <div
          onClick={(e) => e.stopPropagation()}
          className="ml-auto flex items-center gap-x-2"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="hug"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition hover:bg-foreground/15 p-[1px]"
              >
                <Plus className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side="bottom"
              className="text-muted-foreground"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleCreateDocument}
                >
                  <FilePlus className="mr-2 h-4 w-4" />
                  <span>Blank Document</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleCreateFolder}
                >
                  <div className="flex items-center">
                    <FolderPlus className="mr-2 h-4 w-4" />
                    <span>New Folder</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="hug"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition hover:bg-foreground/15 p-[1px]"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side="bottom"
              className="text-muted-foreground"
              onCloseAutoFocus={(e) => e.preventDefault()}
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
        onConfirm={() => handleDelete(id)}
      />
    </>
  );
};

FolderItem.Skeleton = function FolderItemSkeleton({
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
