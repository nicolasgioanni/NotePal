// src/hooks/useRealTimeDocuments.ts
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "@/db/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/db/firebase/config";
import { FlashcardDeck } from "@/models/types";
import { useCurrentUser } from "./use-current-user";

export const useFlashcardDeckById = (documentId: string) => {
  const user = useCurrentUser();
  const [flashcardDeck, setFlashcardDeck] = useState<FlashcardDeck>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (!user || !user.id) {
      setIsLoading(false);
      setError(new Error("User not authenticated"));
      return;
    }

    const userDocumentsRef = doc(db, "users", user.id!);

    const docRef = doc(userDocumentsRef, "flashcard-decks", documentId);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setFlashcardDeck({
            id: docSnap.id,
            ...(docSnap.data() as FlashcardDeck),
          });
          setError(undefined);
        } else {
          setFlashcardDeck(undefined);
          setError(new Error("Flashcard deck does not exist"));
        }
        setIsLoading(false);
      },
      (fetchError) => {
        console.error("Error fetching flashcard deck:", fetchError);
        setError(fetchError);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, documentId]);

  return { flashcardDeck, isLoading, error };
};
