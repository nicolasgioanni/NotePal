"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import TailwindAdvancedEditor from "@/components/editor/advanced-editor";

import { DefaultContent } from "./default-content";

export function DocumentContent() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <div className="flex flex-col">
      <TailwindAdvancedEditor />
      <DefaultContent />
    </div>
  );
}
