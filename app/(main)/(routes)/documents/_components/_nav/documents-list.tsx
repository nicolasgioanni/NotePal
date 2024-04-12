"use client";
import { Document } from "@/models/document";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { auth } from "@/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { Item } from "../item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";
import { Folder } from "@/models/folder";

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
  const [user, loading, error] = useAuthState(auth);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const onExpand = (id?: string) => {
    if (!id) return;
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [id]: !prevExpanded[id],
    }));
  };

  const onRedirect = (documentId?: string) => {
    if (!documentId) return;

    // router.push(`/documents/${documentId}`);
  };

  useEffect(() => {
    if (loading || !user) return;

    // Query for documents
    const docQuery = query(
      collection(db, "documents"),
      where("userId", "==", user.uid),
      where("parentFolderId", "==", parentFolderId || null) // Handle root-level documents
    );

    // Query for folders
    const folderQuery = query(
      collection(db, "folders"),
      where("userId", "==", user.uid),
      where("parentFolderId", "==", parentFolderId || null) // Handle root-level folders
    );

    const unsubscribeDocuments = onSnapshot(docQuery, (querySnapshot) => {
      const loadedDocuments = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Document)
      );
      setDocuments(loadedDocuments);
    });

    const unsubscribeFolders = onSnapshot(folderQuery, (querySnapshot) => {
      const loadedFolders = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Folder)
      );
      setFolders(loadedFolders);
      setIsLoading(false);
    });

    return () => {
      unsubscribeDocuments();
      unsubscribeFolders();
    };
  }, [user, loading, parentFolderId]);

  if (isLoading) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      <p
        style={{
          paddingLeft: level ? `${level * 12}px` : undefined,
        }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground",
          folders.length === 0 &&
            documents.length === 0 &&
            "block ml-2 text-muted-foreground/75"
        )}
      >
        Empty
      </p>
      {folders.map((folder) => (
        <div
          key={folder.id}
          className="flex flex-col gap-y-2"
        >
          <Item
            key={folder.id}
            id={folder.id}
            onClick={() => {}}
            label={folder.name}
            level={level}
            onExpand={() => onExpand(folder.id)}
            expanded={expanded[folder.id!]}
            isFolder
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
          <Item
            key={document.id}
            id={document.id}
            onClick={() => onRedirect(document.id)}
            label={document.title}
            documentIcon={document.icon}
            active={params.documentId === document.id}
            level={level}
            isFile
          />
        </div>
      ))}
    </div>
  );
};
