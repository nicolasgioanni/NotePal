import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "@/db/firebase/config";
import { Document } from "@/models/types";
import { useCurrentUser } from "./use-current-user";

export const useDocuments = (parentFolderId?: string | null) => {
  const user = useCurrentUser();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (!user || !user.id) {
      setIsLoading(false);
      setError(new Error("User not authenticated"));
      return;
    }

    const userDocumentsRef = doc(db, "users", user.id!);
    const documentsRef = collection(userDocumentsRef, "documents");

    const docQuery = query(
      documentsRef,
      where("parentFolderId", "==", parentFolderId || null)
    );

    const unsubscribe = onSnapshot(
      docQuery,
      (querySnapshot) => {
        const loadedDocuments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Document),
        }));
        setDocuments(loadedDocuments);
        setIsLoading(false);
      },
      (fetchError) => {
        console.error("Error fetching documents:", fetchError);
        setError(fetchError);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, parentFolderId]);

  return { documents, isLoading, error };
};
