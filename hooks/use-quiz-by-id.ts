// src/hooks/useRealTimeDocuments.ts
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "@/db/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/db/firebase/config";
import { FlashcardDeck, Quiz } from "@/models/types";
import { useCurrentUser } from "./use-current-user";

export const useQuizById = (quizId: string) => {
  const user = useCurrentUser();
  const [quiz, setQuiz] = useState<Quiz>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (!user || !user.id) {
      setIsLoading(false);
      setError(new Error("User not authenticated"));
      return;
    }

    const userDocumentsRef = doc(db, "users", user.id!);

    const docRef = doc(userDocumentsRef, "quizzes", quizId);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setQuiz({
            id: docSnap.id,
            ...(docSnap.data() as Quiz),
          });
          setError(undefined);
        } else {
          setQuiz(undefined);
          setError(new Error("Quiz does not exist"));
        }
        setIsLoading(false);
      },
      (fetchError) => {
        console.error("Error fetching quiz:", fetchError);
        setError(fetchError);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, quizId]);

  return { quiz, isLoading, error };
};
