"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import Editor from "@/components/editor/advanced-editor";

import { DefaultContent } from "../../../../_components/default-content";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Document } from "@/models/document";
import { useEffect, useState } from "react";
import { DocTitle } from "./doc-title";

export function EditorContent() {
  const [user, loading, error] = useAuthState(auth);
  const [document, setDocument] = useState<Document>();
  const params = useParams();

  return (
    <div>
      <DocTitle documentId={params.documentId as string} />
      <Editor docId={params.documentId as string} />
    </div>
  );
}
