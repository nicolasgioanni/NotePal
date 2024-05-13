"use client";

import Editor from "@/components/editor/advanced-editor";
import { useParams } from "next/navigation";
import { DocTitle } from "./doc-title";
import { useDocumentById } from "@/hooks/use-document-by-id";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Document } from "@/models/types";

interface EditorContentProps {
  initialData?: Document;
}

export function EditorContent({ initialData }: EditorContentProps) {
  const params = useParams();

  return (
    <div className="h-full max-w-4xl w-full min-w-96">
      <DocTitle initialData={initialData} />
      <Editor initialData={initialData} />
    </div>
  );
}
