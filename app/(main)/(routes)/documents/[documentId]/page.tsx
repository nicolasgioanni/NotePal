"use client";

import { EditorContent } from "./_components/editor-content";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scroll } from "lucide-react";
import { useState } from "react";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import { useDocumentById } from "@/hooks/use-document-by-id";

const DocumentIdPage = () => {
  const params = useParams();
  const { document, isLoading, error } = useDocumentById(
    params.documentId as string
  );

  return (
    <div className="flex justify-center">
      <EditorContent initialData={document} />
    </div>
  );
};

export default DocumentIdPage;
