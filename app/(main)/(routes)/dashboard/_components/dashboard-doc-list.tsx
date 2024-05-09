"use client";
import { useRouter } from "next/navigation";
import { DocumentItem } from "../../_components/document-item";
import { useAllDocuments } from "@/hooks/use-documents-by-user";

export const DashboardDocList = () => {
  const router = useRouter();
  const { documents, isLoading, error } = useAllDocuments();

  const onRedirect = (documentId?: string) => {
    if (!documentId) return;

    router.push(`/documents/${documentId}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-2">
        <DocumentItem.Skeleton level={0} />
        <DocumentItem.Skeleton level={0} />
        <DocumentItem.Skeleton level={0} />
        <DocumentItem.Skeleton level={0} />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-sm font-medium text-muted-foreground/65">
        You don&apos;t have any documents yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      {documents.map((doc) => (
        <DocumentItem
          key={doc.id}
          id={doc.id!}
          label={doc.title}
          onClick={() => onRedirect(doc.id)}
        />
      ))}
    </div>
  );
};
