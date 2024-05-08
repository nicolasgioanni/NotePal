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
import {
  FilePlus,
  FolderPlus,
  Plus,
  PlusCircle,
  Search,
  Trash,
} from "lucide-react";
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
import { createFolder } from "@/db/firebase/folder";
import { createDocument } from "@/db/firebase/document";

interface SidebarContentProps {
  isCollapsed: boolean;
}

export function SidebarContent({ isCollapsed }: SidebarContentProps) {
  const search = useSearch();
  const router = useRouter();

  return (
    <>
      <div className={cn("flex flex-col gap-y-2", isCollapsed && "hidden")}>
        <span className="text-muted-foreground truncate font-medium text-sm">
          Documents
        </span>
        <Separator />

        <DocumentsList />
      </div>
    </>
  );
}
