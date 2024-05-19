import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "@/db/firebase/config";
import { FlashcardDeck, Quiz } from "@/models/types";
import { useCurrentUser } from "./use-current-user";

export const useQuizzes = (parentFolderId?: string | null) => {
  const user = useCurrentUser();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (!user || !user.id) {
      setIsLoading(false);
      setError(new Error("User not authenticated"));
      return;
    }

    const userDocumentsRef = doc(db, "users", user.id!);
    const documentsRef = collection(userDocumentsRef, "quizzes");

    const docQuery = query(
      documentsRef,
      where("parentFolderId", "==", parentFolderId || null)
    );

    const unsubscribe = onSnapshot(
      docQuery,
      (querySnapshot) => {
        const loadedDocuments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Quiz),
        }));
        setQuizzes(loadedDocuments);
        setIsLoading(false);
      },
      (fetchError) => {
        console.error("Error fetching quizzes:", fetchError);
        setError(fetchError);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, parentFolderId]);

  return { quizzes, isLoading, error };
};
