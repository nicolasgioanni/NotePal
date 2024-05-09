"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/db/firebase/config";
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "@/db/firebase/config";
import { Document } from "@/models/types";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { defaultEditorContent } from "@/lib/content";
import { createDocument } from "@/db/firebase/document";
import { useCurrentUser } from "@/hooks/use-current-user";

export function DefaultContent() {
  const router = useRouter();
  const user = useCurrentUser();

  const handleCreateDocument = () => {
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

  return (
    <div className="flex flex-col justify-center items-center h-full gap-y-6">
      <Image
        src="/logo.svg"
        height={300}
        width={300}
        alt="Logo"
        className="dark:hidden"
      />
      <Image
        src="/logo-dark.svg"
        height={300}
        width={300}
        alt="Logo"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        <div>
          Welcome to {user?.name}
          &apos;s NotePal
        </div>
      </h2>
      <Button
        variant="secondary"
        onClick={handleCreateDocument}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
}
