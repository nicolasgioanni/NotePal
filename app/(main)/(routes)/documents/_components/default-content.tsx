"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";

export function DefaultContent() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return null;

  return (
    <div className="flex flex-col justify-center items-center h-full">
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
      <Button>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
}
