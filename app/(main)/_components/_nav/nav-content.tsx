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
import { db } from "@/firebase/config";
import { auth } from "@/firebase/config";
import { Document } from "@/models/document";
import { Folder } from "@/models/folder";
import { Item } from "../item";
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

interface NavContentProps {
  isCollapsed: boolean;
}

export function NavContent({ isCollapsed }: NavContentProps) {
  const [user, loading, error] = useAuthState(auth);
  const search = useSearch();

  const handleCreateDocument = () => {
    if (!user) return;

    const newDocument: Document = {
      title: "Untitled",
      userId: user.uid,
      content: "",
      isPublished: false,
      parentFolderId: null,
    };

    const docRef = doc(collection(db, "documents"));
    const promise = setDoc(docRef, newDocument);

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "Note created!",
      error: "Failed to create a new note.",
    });
  };

  const handleCreateFolder = () => {
    if (!user) return;

    const newFolder: Folder = {
      name: "Untitled",
      userId: user.uid,
      parentFolderId: null,
    };

    const docRef = doc(collection(db, "folders"));
    const promise = setDoc(docRef, newFolder);

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
            <div className=" flex flex-row items-center w-full justify-center text-muted-foreground border rounded-md text-sm hover:text-muted-foreground gap-x-[6px] h-9 hover:bg-accent cursor-pointer transition">
              <span className="truncate">Add</span>
              <PlusCircle size={16} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
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
        <Item
          label="Search"
          icon={Search}
          isSearch
          onClick={search.onOpen}
        />
        <DocumentsList />
      </div>
    </>
  );
}
