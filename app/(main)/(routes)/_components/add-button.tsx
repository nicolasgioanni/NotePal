"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createDocument } from "@/db/firebase/document";
import {
  FilePlus,
  FolderPlus,
  Plus,
  PlusCircle,
  WandSparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createFolder } from "@/db/firebase/folder";

interface AddButtonProps {
  button: React.ReactNode;
}

export const AddButton = ({ button }: AddButtonProps) => {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{button}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="right"
        className="text-muted-foreground"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleCreateFolder}
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            <span>New Folder</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleCreateDocument}
          >
            <FilePlus className="mr-2 h-4 w-4" />
            <span>Blank Document</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push("/flashcards")}
          >
            <Zap className="mr-2 h-4 w-4" />
            <span>New Flashcards</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push("/quiz")}
          >
            <WandSparkles className="mr-2 h-4 w-4" />
            <span>New Quiz</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
