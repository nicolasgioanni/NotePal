// src/hooks/useRealTimeDocuments.ts
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { Document } from "@/models/types";

export const useDocumentById = (documentId: string) => {
  const [user, loading, authError] = useAuthState(auth);
  const [document, setDocument] = useState<Document>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(authError);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setIsLoading(false);
      setError(new Error("User not authenticated"));
      return;
    }

    const docRef = doc(db, "documents", documentId);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setDocument({
            id: docSnap.id,
            ...(docSnap.data() as Document),
          });
          setError(undefined);
        } else {
          setDocument(undefined);
          setError(new Error("Document does not exist"));
        }
        setIsLoading(false);
      },
      (fetchError) => {
        console.error("Error fetching document:", fetchError);
        setError(fetchError);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, loading, documentId]);

  return { document, isLoading, error };
};
