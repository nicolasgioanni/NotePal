"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ChevronDown,
  ChevronRight,
  File,
  FilePlus,
  FolderPlus,
  LucideIcon,
  MoreHorizontal,
  Plus,
  TextCursorInput,
  Trash,
  Undo,
  Undo2,
} from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/config";
import { Document } from "@/models/document";
import { toast } from "sonner";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Folder } from "@/models/folder";
import { useState, useRef, useEffect } from "react";
import { DeleteAlertDialog } from "./delete-alert-dialog";
import { defaultEditorContent } from "@/lib/content";

interface ItemProps {
  id?: string;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  isFile?: boolean;
  isFolder?: boolean;
  level?: number;
  label: string;
  onExpand?: () => void;
  onClick?: () => void;
  icon?: LucideIcon;
}

export const Item = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  isSearch,
  isFile,
  isFolder,
  level = 0,
  onExpand,
  expanded,
}: ItemProps) => {
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;
  const [user, loading, error] = useAuthState(auth);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, isFolder ? "folders" : "documents", id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setTitle(snapshot.data().title);
      }
    });
    return () => unsubscribe();
  }, [id, isFolder]);

  const setDocumentTitle = async (title: string) => {
    if (!id) return;
    if (title.trim() === "") title = "Untitled";
    updateDoc(doc(db, isFolder ? "folders" : "documents", id), {
      title: title,
    }).catch((error) => {
      console.error("Error updating title: ", error);
    });
  };

  const enableInput = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    setTitle(label);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setDocumentTitle(title);
    setIsEditing(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      disableInput();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleOnExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const handleCreateDocument = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (!id || !user) return;

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
        onExpand?.();
      }
      router.push(`/documents/${docRef.id}`);
    });

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "Note created!",
      error: "Failed to create a new note.",
    });
  };

  const handleCreateFolder = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (!id || !user) return;

    const newFolder: Folder = {
      title: "Untitled",
      userId: user.uid,
      parentFolderId: id,
    };

    const docRef = doc(collection(db, "folders"));
    const promise = setDoc(docRef, newFolder).then(() => {
      if (!expanded) {
        onExpand?.();
      }
    });

    toast.promise(promise, {
      loading: "Creating a new folder...",
      success: "Folder created!",
      error: "Failed to create a new folder.",
    });
  };

  const handleDelete = async (id: string, isFolder: boolean) => {
    if (!user || isFolder == undefined) return;

    const deleteAction = isFolder
      ? deleteFolder(id, user.uid)
      : deleteDocument(id, user.uid);

    toast.promise(deleteAction, {
      loading: isFolder ? "Deleting folder..." : "Deleting document...",
      success: isFolder ? "Folder deleted!" : "Document deleted!",
      error: isFolder
        ? "Failed to delete folder."
        : "Failed to delete document.",
    });
  };

  const deleteDocument = async (documentId: string, userId: string) => {
    const docRef = doc(db, "documents", documentId);
    return deleteDoc(docRef); // Use deleteDoc to remove the document
  };

  const deleteFolder = async (folderId: string, userId: string) => {
    const folderRef = doc(db, "folders", folderId);
    await deleteDoc(folderRef); // Delete the folder itself

    // Recursively delete all contents
    const subFoldersQuery = query(
      collection(db, "folders"),
      where("parentFolderId", "==", folderId),
      where("userId", "==", userId)
    );
    const subFoldersSnapshot = await getDocs(subFoldersQuery);

    for (const doc of subFoldersSnapshot.docs) {
      await deleteFolder(doc.id, userId); // Recursive call
    }

    const documentsQuery = query(
      collection(db, "documents"),
      where("parentFolderId", "==", folderId),
      where("userId", "==", userId)
    );
    const documentsSnapshot = await getDocs(documentsQuery);

    for (const doc of documentsSnapshot.docs) {
      await deleteDocument(doc.id, userId);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (isFolder) handleOnExpand(e);
        else onClick ? onClick() : {};
      }}
      role="button"
      style={{ marginLeft: level ? `${level * 14}px` : "0px" }}
      className={cn(
        "group min-h-[27px] py-1.5 pr-2 flex items-center hover:bg-accent font-medium text-muted-foreground rounded-md text-sm transition pl-1",
        active && "bg-accent text-accent-foreground",
        isSearch && "bg-accent/50 py-2 pl-2"
      )}
    >
      {Icon && <Icon className="h-4 w-4 mr-2" />}
      {!!id && (
        <div className="h-full rounded-sm flex items-center">
          {isFolder ? <ChevronIcon className="h-4 shrink-0 mr-1" /> : null}
          {isFile ? <File className=" h-4 shrink-0 mr-1" /> : null}
        </div>
      )}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className="h-5 px-2 mr-2 focus-visible:ring-transparent"
        />
      ) : (
        <span className="truncate">{title}</span>
      )}

      {isSearch && (
        <kbd className="group-hover:opacity-0 transition ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          {isFolder && (
            <div className="opacity-0 group-hover:opacity-100 p-[1px] h-full ml-auto rounded-sm transition hover:bg-foreground/15">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Plus className="h-4 w-4 text-muted-foreground " />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={(e) => {
                        handleCreateDocument(e);
                      }}
                    >
                      <div className="text-muted-foreground flex items-center">
                        <FilePlus className="mr-2 h-4 w-4 " />
                        <span>Blank Document</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={handleCreateFolder}
                    >
                      <div className="text-muted-foreground flex items-center">
                        <FolderPlus className="mr-2 h-4 w-4" />
                        <span>New Folder</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <div className="opacity-0 group-hover:opacity-100 p-[1px] h-full ml-auto rounded-sm transition hover:bg-foreground/15">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={(e) => {
                    enableInput(e);
                  }}
                >
                  <div className="text-muted-foreground flex items-center">
                    <TextCursorInput className="mr-2 h-4 w-4" />
                    <span>Rename</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer group/delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteDialogOpen(true);
                  }}
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
      )}
      <DeleteAlertDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={() => {
          handleDelete(id!, isFolder ? true : false);
        }}
      />
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div style={{ paddingLeft: level ? `${level * 12}px` : "0px" }}>
      <Skeleton className="h-8 w-full" />
    </div>
  );
};
