// src/hooks/useRealTimeDocuments.ts
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "@/db/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/db/firebase/config";
import {
  FlashcardDeck,
  PracticeQuiz,
  PracticeQuizResult,
  Quiz,
} from "@/models/types";
import { useCurrentUser } from "./use-current-user";

export const useQuizResultsById = (quizId: string) => {
  const user = useCurrentUser();
  const [quizResults, setQuizResults] = useState<PracticeQuizResult[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (!user || !user.id) {
      setIsLoading(false);
      setError(new Error("User not authenticated"));
      return;
    }

    const userDocumentsRef = doc(db, "users", user.id!);

    const collectionRef = collection(userDocumentsRef, "quiz-results");
    const q = query(collectionRef, where("quizId", "==", quizId));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (querySnapshot.docs.length === 0) {
          setIsLoading(false);
          setError(new Error("Quiz results does not exist"));
          return;
        }
        const docs = querySnapshot.docs;
        setQuizResults(
          docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as PracticeQuizResult),
            dateCreated: doc.data().dateCreated.toDate(),
          }))
        );
        setIsLoading(false);
        setError(undefined);
      },
      (fetchError) => {
        console.error("Error fetching quiz results:", fetchError);
        setError(fetchError);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, quizId]);

  return { quizResults, isLoading, error };
};
