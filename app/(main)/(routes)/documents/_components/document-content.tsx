"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import TailwindAdvancedEditor from "@/components/editor/advanced-editor";

import { DefaultContent } from "./default-content";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function DocumentContent() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <div className="py-5 h-full">
      <div className="flex flex-row w-full justify-start mb-3 px-4 items-center">
        <div className="px-2 py-1 hover:bg-accent hover:cursor-pointer rounded-md font-semibold">
          Header
        </div>
      </div>
      <div className="px-4">
        <Separator />
      </div>
      <ScrollArea className="h-full">
        <TailwindAdvancedEditor />
      </ScrollArea>
    </div>
  );
}
