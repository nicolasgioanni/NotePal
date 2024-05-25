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
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./config";
import {
  FlashcardDeck,
  FlashcardDeckCreateData,
  FlashcardDeckUpdateData,
  Flashcard,
  FlashcardUpdateData,
  FlashcardCreateData,
  QuizCreateData,
  Quiz,
  QuizUpdateData,
  QuestionCreateData,
  Question,
  QuestionUpdateData,
  PracticeQuiz,
  PracticeQuizUpdateData,
} from "@/models/types";
import { v4 as uuidv4 } from "uuid";

export const createPracticeQuiz = async (quizId: string) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Authentication required to create practice quiz.");
  }

  if (!user.id) {
    throw new Error("User ID is required");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("User not found");
  }

  // Check if a practice quiz with the same quizId already exists
  const practiceQuizCollectionRef = collection(
    db,
    "users",
    user.id,
    "practice-quizzes"
  );
  const q = query(practiceQuizCollectionRef, where("quizId", "==", quizId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    throw new Error("Practice quiz already exists");
  }

  //get the quiz version
  const quizDocRef = doc(db, "users", user.id, "quizzes", quizId);
  const quizDocSnapshot = await getDoc(quizDocRef);
  if (!quizDocSnapshot.exists()) {
    throw new Error("Quiz not found");
  }
  const quizData = quizDocSnapshot.data() as Quiz;
  const quizVersion = quizData.version;

  const practiceQuizData: PracticeQuiz = {
    quizId: quizId,
    userId: user.id,
    currentQuestionIndex: 0,
    questions: quizData.questions,
    userAnswers: [],
    timeStarted: new Date(),
  };

  try {
    const userDocRef = doc(db, "users", user.id);
    const documentsCollectionRef = collection(userDocRef, "practice-quizzes");

    const docRefId = await addDoc(
      documentsCollectionRef,
      practiceQuizData
    ).then(async (docRef) => {
      console.log("Practice quiz written with ID: ", docRef.id);

      return docRef.id;
    });
    return docRefId;
  } catch (error) {
    throw new Error("Failed to create a new practice quiz");
  }
};

export const getPracticeQuizByQuizId = async (quizId: string) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("Authentication required to get practice quiz.");
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
    const collectionRef = collection(userDocRef, "practice-quizzes");

    const q = query(collectionRef, where("quizId", "==", quizId));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const documentData = querySnapshot.docs[0].data() as PracticeQuiz;

    return JSON.stringify(documentData);
  } catch (error) {
    throw new Error("Failed to get practice quiz");
  }
};

export const updatePracticeQuiz = async (
  quizId: string,
  data: PracticeQuizUpdateData
) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Authentication required to update practice quiz.");
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
    const collectionRef = collection(userDocRef, "practice-quizzes");
    const q = query(collectionRef, where("quizId", "==", quizId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error("Practice quiz not found");
    }

    const existingData = querySnapshot.docs[0].data() as PracticeQuiz;
    const existingUserAnswers = existingData.userAnswers;

    if (data.userAnswers) {
      data.userAnswers.forEach((newUserAnswer) => {
        const existingUserAnswerIndex = existingUserAnswers.findIndex(
          (existingUserAnswer) =>
            existingUserAnswer.questionId === newUserAnswer.questionId
        );

        if (existingUserAnswerIndex !== -1) {
          existingUserAnswers[existingUserAnswerIndex] = newUserAnswer;
        } else {
          existingUserAnswers.push(newUserAnswer);
        }
      });
    }

    await updateDoc(querySnapshot.docs[0].ref, {
      ...data,
      userAnswers: existingUserAnswers,
    });
  } catch (error) {
    throw new Error("Failed to update the practice quiz");
  }
};

export const deletePracticeQuiz = async (quizId: string) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("Authentication required to delete practice quiz.");
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
    const collectionRef = collection(userDocRef, "practice-quizzes");
    const q = query(collectionRef, where("quizId", "==", quizId));
    const querySnapshot = await getDocs(q);
    const documentRef = querySnapshot.docs[0].ref;

    await deleteDoc(documentRef);
  } catch (error) {
    throw new Error("Failed to delete the practice quiz");
  }
};

export const resetPracticeQuiz = async (quizId: string) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("Authentication required to restart practice quiz.");
  }

  if (!user.id) {
    throw new Error("User ID is required");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("User not found");
  }

  const userDocRef = doc(db, "users", user.id);
  const collectionRef = collection(userDocRef, "practice-quizzes");
  const q = query(collectionRef, where("quizId", "==", quizId));
  const querySnapshot = await getDocs(q);
  const practiceQuizRef = querySnapshot.docs[0].ref;

  await updateDoc(practiceQuizRef, {
    currentQuestionIndex: 0,
    timeStarted: new Date(),
    userAnswers: [],
  });
};
