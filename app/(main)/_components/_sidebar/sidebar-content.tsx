import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/db/firebase/config";
import { auth } from "@/db/firebase/config";
import { Document, Folder } from "@/models/types";
import { FilePlus, FolderPlus, PlusCircle, Search, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DocumentsList } from "./documents-list";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useSearch } from "@/hooks/use-search";
import { useRouter } from "next/navigation";
import { defaultEditorContent } from "@/lib/content";
import { SearchButton } from "./search-button";
import { createFolder } from "@/db/firebase/folder";
import { createDocument } from "@/db/firebase/document";

interface SidebarContentProps {
  isCollapsed: boolean;
}

export function SidebarContent({ isCollapsed }: SidebarContentProps) {
  const search = useSearch();
  const router = useRouter();

  const handleCreateDocument = async () => {
    const promise = createDocument()
      .then((docId) => {
        router.push(`/documents/${docId}`);
      })
      .catch((error) => {
        console.error(error);
      });

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "Note created!",
      error: "Failed to create a new note.",
    });
  };

  const handleCreateFolder = () => {
    const promise = createFolder().catch((error) => {
      console.error(error);
    });

    toast.promise(promise, {
      loading: "Creating a new folder...",
      success: "Folder created!",
      error: "Failed to create a new folder.",
    });
  };

  return (
    <>
      <div className={cn("h-full", !isCollapsed && "hidden")}></div>
      <div
        className={cn("h-full flex flex-col gap-y-3", isCollapsed && "hidden")}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="shrink-0 h-9"
            >
              <span className="truncate">Add</span>
              <PlusCircle className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
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
                <FolderPlus className="mr-2 h-4 w-4" />
                <span>New Folder</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <SearchButton onClick={search.onOpen} />
        <DocumentsList />
      </div>
    </>
  );
}
