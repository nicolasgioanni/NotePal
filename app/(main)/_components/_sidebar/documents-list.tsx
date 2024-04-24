"use client";
import { Document, Folder } from "@/models/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { auth } from "@/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";
import { DocumentItem } from "./document-item";
import { FolderItem } from "./folder-item";
import { useDocuments } from "@/hooks/use-documents";
import { useFolders } from "@/hooks/use-folders";

interface DocumentsListProps {
  parentFolderId?: string;
  level?: number;
  data?: Document[];
}

export const DocumentsList = ({
  parentFolderId,
  level = 0,
}: DocumentsListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const {
    documents,
    isLoading: documentsLoading,
    error: documentsError,
  } = useDocuments(parentFolderId);
  const {
    folders,
    isLoading: foldersLoading,
    error: foldersError,
  } = useFolders(parentFolderId);

  const onExpand = (id?: string) => {
    if (!id) return;
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [id]: !prevExpanded[id],
    }));
  };

  const onRedirect = (documentId?: string) => {
    if (!documentId) return;

    router.push(`/documents/${documentId}`);
  };

  if (documentsLoading || foldersLoading) {
    return (
      <>
        <DocumentItem.Skeleton level={level} />
        {level === 0 && (
          <>
            <DocumentItem.Skeleton level={level} />
            <DocumentItem.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      <p
        style={{
          marginLeft: level ? `${level * 12}px` : undefined,
        }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground px-4",
          folders.length === 0 &&
            documents.length === 0 &&
            "block text-muted-foreground/65"
        )}
      >
        Empty
      </p>
      {folders.map((folder) => (
        <div
          key={folder.id}
          className="flex flex-col gap-y-2"
        >
          <FolderItem
            id={folder.id!}
            label={folder.title}
            onClick={() => onExpand(folder.id)}
            expanded={expanded[folder.id!]}
            level={level}
          />
          <div className={cn("hidden", expanded[folder.id!] && "block")}>
            <DocumentsList
              parentFolderId={folder.id}
              level={level + 1}
            />
          </div>
        </div>
      ))}
      {documents.map((document) => (
        <div key={document.id}>
          <DocumentItem
            id={document.id as string}
            label={document.title}
            onClick={() => onRedirect(document.id)}
            active={params.documentId === document.id}
            level={level}
          />
        </div>
      ))}
    </div>
  );
};
