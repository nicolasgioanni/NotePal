"use client";

import Editor from "@/components/editor/advanced-editor";
import { useParams } from "next/navigation";
import { DocTitle } from "./doc-title";
import { useDocumentById } from "@/hooks/use-document-by-id";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function EditorContent() {
  const params = useParams();

  return (
    <div className="h-full max-w-4xl w-full">
      <DocTitle docId={params.documentId as string} />
      <Editor docId={params.documentId as string} />
    </div>
  );
}
