"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Document } from "@/models/document";
import { toast } from "sonner";

export function DefaultContent() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return null;

  const handleCreateDocument = () => {
    if (!user) return;

    const newDocument: Document = {
      title: "Untitled",
      userId: user.uid,
      isArchived: false,
      content: "",
      isPublished: false,
    };

    const docRef = doc(collection(db, "documents"));
    const promise = setDoc(docRef, newDocument);

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
        {user ? (
          <>
            Welcome to {user.displayName ? user.displayName : user.email}
            &apos; NotePal
          </>
        ) : null}
      </h2>
      <Button onClick={handleCreateDocument}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
}
