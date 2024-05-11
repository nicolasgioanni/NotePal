import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "@/db/firebase/config";
import { FlashcardDeck } from "@/models/types";
import { useCurrentUser } from "./use-current-user";

export const useAllFlashcardDecks = () => {
  const user = useCurrentUser();
  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (!user || !user.id) {
      setIsLoading(false);
      setError(new Error("User not authenticated"));
      return;
    }

    const userDocumentsRef = doc(db, "users", user.id!);
    const documentsRef = collection(userDocumentsRef, "flashcard-decks");

    const docQuery = query(documentsRef);

    const unsubscribe = onSnapshot(
      docQuery,
      (querySnapshot) => {
        const loadedDocuments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as FlashcardDeck),
        }));
        setFlashcardDecks(loadedDocuments);
        setIsLoading(false);
      },
      (fetchError) => {
        console.error("Error fetching flashcard decks:", fetchError);
        setError(fetchError);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { flashcardDecks, isLoading, error };
};
