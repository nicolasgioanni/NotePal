// src/hooks/useRealTimeDocuments.ts
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "@/db/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/db/firebase/config";
import { FlashcardDeck, PracticeQuiz, Quiz } from "@/models/types";
import { useCurrentUser } from "./use-current-user";

export const usePracticeQuizById = (quizId: string) => {
  const user = useCurrentUser();
  const [practiceQuiz, setPracticeQuiz] = useState<PracticeQuiz>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (!user || !user.id) {
      setIsLoading(false);
      setError(new Error("User not authenticated"));
      return;
    }

    const userDocumentsRef = doc(db, "users", user.id!);

    const collectionRef = collection(userDocumentsRef, "practice-quizzes");
    const q = query(collectionRef, where("quizId", "==", quizId));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (querySnapshot.docs.length === 0) {
          setIsLoading(false);
          setError(new Error("Practice quiz does not exist"));
          return;
        }
        const doc = querySnapshot.docs[0];
        setPracticeQuiz({
          id: doc.id,
          ...(doc.data() as PracticeQuiz),
        });
        setIsLoading(false);
        setError(undefined);
      },
      (fetchError) => {
        console.error("Error fetching practice quiz:", fetchError);
        setError(fetchError);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, quizId]);

  return { practiceQuiz, isLoading, error };
};
