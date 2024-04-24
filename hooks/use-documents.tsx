import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { Document } from "@/models/types";

export const useDocuments = (parentFolderId?: string | null) => {
  const [user, loading, authError] = useAuthState(auth);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(authError);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setIsLoading(false);
      setError(new Error("User not authenticated"));
      return;
    }

    const docQuery = query(
      collection(db, "documents"),
      where("userId", "==", user.uid),
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
  }, [user, loading, parentFolderId]);

  return { documents, isLoading, error };
};
