import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "@/db/firebase/config";
import { Folder } from "@/models/types";
import { useCurrentUser } from "./use-current-user";

export const useFolders = (parentFolderId?: string | null) => {
  const user = useCurrentUser();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (!user || !user.id) {
      setIsLoading(false);
      setError(new Error("User not authenticated"));
      return;
    }

    const userDocumentsRef = doc(db, "users", user.id!);
    const foldersRef = collection(userDocumentsRef, "folders");

    const docQuery = query(
      foldersRef,
      where("parentFolderId", "==", parentFolderId || null)
    );

    const unsubscribe = onSnapshot(
      docQuery,
      (querySnapshot) => {
        const loadedDocuments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Folder),
        }));
        setFolders(loadedDocuments);
        setIsLoading(false);
      },
      (fetchError) => {
        console.error("Error fetching folders:", fetchError);
        setError(fetchError);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, parentFolderId]);

  return { folders, isLoading, error };
};
