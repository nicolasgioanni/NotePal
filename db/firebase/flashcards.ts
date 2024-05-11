"use server";

import { currentUser } from "@/lib/auth";
import { getUserById } from "./user";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./config";
import {
  FlashcardDeck,
  FlashcardDeckCreateData,
  FlashcardDeckUpdateData,
  Flashcard,
  FlashcardUpdateData,
  FlashcardCreateData,
} from "@/models/types";
import { v4 as uuidv4 } from "uuid";

export const createFlashcardDeck = async (data: FlashcardDeckCreateData) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Authentication required to create flashcardDeck.");
  }

  if (!user.id) {
    throw new Error("User ID is required");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("User not found");
  }

  const deckData = {
    title: data.title,
    parentFolderId: data.parentFolderId || null,
    userId: user.id,
    createdAt: new Date(),
    flashcards: data.flashcards,
  };

  try {
    const userDocRef = doc(db, "users", user.id);
    const documentsCollectionRef = collection(userDocRef, "flashcard-decks");

    // const embedding = await getEmbeddingForDoc(defaultData.title);

    const docRefId = await addDoc(documentsCollectionRef, deckData).then(
      async (docRef) => {
        console.log("Flashcard deck written with ID: ", docRef.id);

        return docRef.id;
      }
    );
    return docRefId;
  } catch (error) {
    throw new Error("Failed to create a new flashcard deck");
  }
};

export const getFlashcardDeckById = async (deckId: string) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("Authentication required to get flashcard deck.");
  }

  if (!user.id) {
    throw new Error("User ID is required");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("User not found");
  }

  try {
    const userDocRef = doc(db, "users", user.id);
    const documentRef = doc(userDocRef, "flashcard-decks", deckId);

    const documentSnapshot = await getDoc(documentRef);

    if (!documentSnapshot.exists()) {
      throw new Error("Flashcard deck not found");
    }

    const documentData = documentSnapshot.data() as FlashcardDeck;

    return JSON.stringify(documentData);
  } catch (error) {
    throw new Error("Failed to get flashcard deck");
  }
};

export const updateFlashcardDeck = async (
  deckId: string,
  data: FlashcardDeckUpdateData
) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Authentication required to update flashcard deck.");
  }

  if (!user.id) {
    throw new Error("User ID is required");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("User not found");
  }

  try {
    const userDocRef = doc(db, "users", user.id);
    const documentRef = doc(userDocRef, "flashcard-decks", deckId);

    await updateDoc(documentRef, { ...data });
  } catch (error) {
    throw new Error("Failed to update the document");
  }
};

export const deleteFlashcardDeck = async (deckId: string) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("Authentication required to delete documents.");
  }

  if (!user.id) {
    throw new Error("User ID is required");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("User not found");
  }

  try {
    const userDocRef = doc(db, "users", user.id);
    const documentRef = doc(userDocRef, "flashcard-decks", deckId);

    await deleteDoc(documentRef);
  } catch (error) {
    throw new Error("Failed to delete the document");
  }
};

export const createFlashcard = async (
  deckId: string,
  data: FlashcardCreateData
) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Authentication required to create flashcard.");
  }

  if (!user.id) {
    throw new Error("User ID is required");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("User not found");
  }

  const newFlashcardData = {
    id: uuidv4(),
    front: data.front,
    back: data.back,
  };

  try {
    const userDocRef = doc(db, "users", user.id);
    const documentRef = doc(userDocRef, "flashcard-decks", deckId);
    const docSnapshot = await getDoc(documentRef);

    if (!docSnapshot.exists()) {
      throw new Error("Flashcard deck not found");
    }

    const currentFlashcards =
      (docSnapshot.data().flashcards as Flashcard[]) || [];

    const updatedFlashcards = [...currentFlashcards, newFlashcardData];

    await updateDoc(documentRef, { flashcards: updatedFlashcards });
  } catch (error) {
    throw new Error("Failed to create the flashcard");
  }
};

export const updateFlashcard = async (
  deckId: string,
  flashcardId: string,
  data: FlashcardUpdateData
) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Authentication required to update flashcard.");
  }

  if (!user.id) {
    throw new Error("User ID is required");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("User not found");
  }

  try {
    const userDocRef = doc(db, "users", user.id);
    const documentRef = doc(userDocRef, "flashcard-decks", deckId);
    const docSnapshot = await getDoc(documentRef);

    if (!docSnapshot.exists()) {
      throw new Error("Flashcard deck not found");
    }

    const currentFlashcards =
      (docSnapshot.data().flashcards as Flashcard[]) || [];

    const updatedFlashcards = currentFlashcards.map((flashcard) => {
      if (flashcard.id === flashcardId) {
        return { ...flashcard, ...data };
      }
      return flashcard;
    });

    await updateDoc(documentRef, { flashcards: updatedFlashcards });
  } catch (error) {
    throw new Error("Failed to update the flashcard");
  }
};

export const deleteFlashcard = async (deckId: string, flashcardId: string) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Authentication required to delete flashcard.");
  }

  if (!user.id) {
    throw new Error("User ID is required");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("User not found");
  }

  try {
    const userDocRef = doc(db, "users", user.id);
    const documentRef = doc(userDocRef, "flashcard-decks", deckId);
    const docSnapshot = await getDoc(documentRef);

    if (!docSnapshot.exists()) {
      throw new Error("Flashcard deck not found");
    }

    const currentFlashcards =
      (docSnapshot.data().flashcards as FlashcardDeck[]) || [];

    const updatedFlashcards = currentFlashcards.filter(
      (flashcard) => flashcard.id !== flashcardId
    );

    await updateDoc(documentRef, { flashcards: updatedFlashcards });
  } catch (error) {
    throw new Error("Failed to delete the flashcard");
  }
};
