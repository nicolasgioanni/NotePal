"use server";
import { currentUser } from "@/lib/auth";
import { getUserById } from "./user";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./config";
import { getPracticeQuizByQuizId } from "./practice-quiz";
import { PracticeQuiz } from "@/models/types";

export const createQuizResult = async (quizId: string) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Authentication required to create quiz result.");
  }

  if (!user.id) {
    throw new Error("User ID is required");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("User not found");
  }

  try {
    const practiceQuiz = await getPracticeQuizByQuizId(quizId);

    if (!practiceQuiz) {
      throw new Error("Practice quiz not found");
    }
    const parsedPracticeQuiz = JSON.parse(practiceQuiz) as PracticeQuiz;

    const data = {
      quizId: parsedPracticeQuiz.quizId,
      userId: user.id,
      questions: parsedPracticeQuiz.questions,
      userAnswers: parsedPracticeQuiz.userAnswers,
      dateCreated: new Date(),
    };

    const userDocRef = doc(db, "users", user.id);
    const collectionRef = collection(userDocRef, "quiz-results");

    const docRefId = await addDoc(collectionRef, data);

    return docRefId.id;
  } catch (error) {
    throw new Error("Failed to create a new quiz result");
  }
};

export const getQuizResultsByQuizId = async (quizId: string) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Authentication required to get quiz results.");
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
    const collectionRef = collection(userDocRef, "quiz-results");
    const q = query(collectionRef, where("quizId", "==", quizId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const quizResults = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        dateCreated: doc.data().dateCreated.toDate(),
      };
    });

    return quizResults;
  } catch (error) {
    throw new Error("Failed to get quiz results");
  }
};

export const deleteQuizResults = async (quizId: string) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Authentication required to delete quiz results.");
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
    const collectionRef = collection(userDocRef, "quiz-results");
    const q = query(collectionRef, where("quizId", "==", quizId));
    const querySnapshot = await getDocs(q);

    const deleteDocs = async () => {
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    };

    await deleteDocs();
  } catch (error) {
    throw new Error("Failed to delete quiz results");
  }
};
