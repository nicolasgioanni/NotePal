"use client";

import Editor from "@/components/editor/advanced-editor";
import { useParams } from "next/navigation";
import { DocTitle } from "./doc-title";
import { useDocumentById } from "@/hooks/use-document-by-id";
import { LoadingSkeleton } from "./loading-skeleton";

export function EditorContent() {
  const params = useParams();
  const { document, isLoading, error } = useDocumentById(
    params.documentId as string
  );

  if (isLoading) {
    return (
      <div className="px-8 sm:px-12 pt-12">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return <div>Oops, something went wrong</div>;
  }

  if (!document) {
    return <div>Document does not exist</div>;
  }

  return (
    <div>
      <DocTitle initialData={document} />
      <Editor initialData={document} />
    </div>
  );
}
