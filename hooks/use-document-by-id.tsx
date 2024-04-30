// src/hooks/useRealTimeDocuments.ts
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "@/db/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/db/firebase/config";
import { Document } from "@/models/types";
import { useCurrentUser } from "./use-current-user";

export const useDocumentById = (documentId: string) => {
  const user = useCurrentUser();
  const [document, setDocument] = useState<Document>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (!user || !user.id) {
      setIsLoading(false);
      setError(new Error("User not authenticated"));
      return;
    }

    const userDocumentsRef = doc(db, "users", user.id!);
    const docRef = doc(userDocumentsRef, "documents", documentId);
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
  }, [user, documentId]);

  return { document, isLoading, error };
};
