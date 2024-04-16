"use client";

import { Skeleton } from "@/components/ui/skeleton";
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
} from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/config";
import { Document } from "@/models/document";
import { toast } from "sonner";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Folder } from "@/models/folder";

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
  onClick: () => void;
  icon?: LucideIcon;
}

export const Item = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  documentIcon,
  isSearch,
  isFile,
  isFolder,
  level = 0,
  onExpand,
  expanded,
}: ItemProps) => {
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

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
      isArchived: false,
      content: "",
      isPublished: false,
      parentFolderId: id,
    };

    const docRef = doc(collection(db, "documents"));
    const promise = setDoc(docRef, newDocument).then(() => {
      if (!expanded) {
        onExpand?.();
      }
      // router.push(`/documents/${docRef.id}`);
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
      name: "Untitled",
      userId: user.uid,
      isArchived: false,
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

  const handleArchive = async (id: string, isFolder: boolean | undefined) => {
    if (!user || !!isFolder) return;

    const archiveAction = isFolder
      ? archiveFolder(id, user.uid)
      : archiveDocument(id, user.uid);

    toast.promise(archiveAction, {
      loading: isFolder ? "Archiving folder..." : "Archiving document...",
      success: isFolder ? "Folder archived!" : "Document archived!",
      error: isFolder
        ? "Failed to archive folder."
        : "Failed to archive document.",
    });
  };

  const archiveDocument = async (documentId: string, userId: string) => {
    const docRef = doc(db, "documents", documentId);
    return updateDoc(docRef, { isArchived: true }); // This returns a promise
  };

  const archiveFolder = async (folderId: string, userId: string) => {
    const folderRef = doc(db, "folders", folderId);
    await updateDoc(folderRef, { isArchived: true }); // Archive the folder itself

    // Recursively archive all contents
    const subFoldersQuery = query(
      collection(db, "folders"),
      where("parentFolderId", "==", folderId),
      where("userId", "==", userId)
    );
    const subFoldersSnapshot = await getDocs(subFoldersQuery);

    for (const doc of subFoldersSnapshot.docs) {
      await archiveFolder(doc.id, userId); // Recursive call
    }

    const documentsQuery = query(
      collection(db, "documents"),
      where("parentFolderId", "==", folderId),
      where("userId", "==", userId)
    );
    const documentsSnapshot = await getDocs(documentsQuery);

    for (const doc of documentsSnapshot.docs) {
      await archiveDocument(doc.id, userId);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (isFolder) handleOnExpand(e);
        else onClick();
      }}
      role="button"
      style={{ marginLeft: level ? `${level * 14}px` : "0px" }}
      className={cn(
        "group min-h-[27px] py-1.5 pr-2 flex items-center hover:bg-accent font-medium text-muted-foreground rounded-md text-sm transition pl-1",
        active && "bg-accent text-accent-foreground",
        isSearch && "bg-accent/50 py-2"
      )}
    >
      {!!id && (
        <div className="h-full rounded-sm flex items-center">
          {isFolder ? <ChevronIcon className="h-4 shrink-0 mr-1" /> : null}
          {isFile ? <File className=" h-4 shrink-0 mr-1" /> : null}
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-1 text-base">{documentIcon}</div>
      ) : (
        Icon && <Icon className="shrink-0 h-4 mr-1" />
      )}

      <span className="truncate">{label}</span>
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
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  <div className="text-muted-foreground flex items-center">
                    <TextCursorInput className="mr-2 h-4 w-4" />
                    <span>Rename</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArchive(id, isFolder);
                  }}
                >
                  <div className="text-muted-foreground flex items-center">
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Archive</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
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
