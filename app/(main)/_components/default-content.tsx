"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Document } from "@/models/types";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { defaultEditorContent } from "@/lib/content";

export function DefaultContent() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  const handleCreateDocument = () => {
    if (!user) return;

    const newDocument: Document = {
      title: "Untitled",
      userId: user.uid,
      content: defaultEditorContent,
      isPublished: false,
      parentFolderId: null,
    };

    const docRef = doc(collection(db, "documents"));
    const promise = setDoc(docRef, newDocument).then(() => {
      router.push(`/documents/${docRef.id}`);
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
        {loading ? <Skeleton className="w-72 h-7" /> : null}
        {user ? (
          <>
            Welcome to {user.displayName ? user.displayName : user.email}
            &apos; NotePal
          </>
        ) : null}
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
