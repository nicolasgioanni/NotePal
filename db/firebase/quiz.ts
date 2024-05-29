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
  QuizCreateData,
  Quiz,
  QuizUpdateData,
  QuestionCreateData,
  Question,
  QuestionUpdateData,
} from "@/models/types";
import { v4 as uuidv4 } from "uuid";
import { version } from "os";
import { deletePracticeQuiz } from "./practice-quiz";
import { deleteQuizResults } from "./quiz-result";

export const createQuiz = async (data: QuizCreateData) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Authentication required to create quiz.");
  }

  if (!user.id) {
    throw new Error("User ID is required");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("User not found");
  }

  const quizData = {
    title: data.title,
    parentFolderId: data.parentFolderId || null,
    userId: user.id,
    createdAt: new Date(),
    questions: data.questions,
    version: 0,
  };

  try {
    const userDocRef = doc(db, "users", user.id);
    const documentsCollectionRef = collection(userDocRef, "quizzes");

    const docRefId = await addDoc(documentsCollectionRef, quizData).then(
      async (docRef) => {
        console.log("Quiz written with ID: ", docRef.id);

        return docRef.id;
      }
    );
    return docRefId;
  } catch (error) {
    throw new Error("Failed to create a new quiz");
  }
};

export const getQuizById = async (quizId: string) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("Authentication required to get quiz.");
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
    const documentRef = doc(userDocRef, "quizzes", quizId);

    const documentSnapshot = await getDoc(documentRef);

    if (!documentSnapshot.exists()) {
      throw new Error("Quiz not found");
    }

    const documentData = documentSnapshot.data() as Quiz;

    return JSON.stringify(documentData);
  } catch (error) {
    throw new Error("Failed to get quiz");
  }
};

export const updateQuiz = async (quizId: string, data: QuizUpdateData) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Authentication required to update quiz.");
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
    const documentRef = doc(userDocRef, "quizzes", quizId);
    const docSnapshot = await getDoc(documentRef);
    if (!docSnapshot.exists()) {
      throw new Error("Quiz not found");
    }

    const version = docSnapshot.data().version;

    await updateDoc(documentRef, { ...data, version: version + 1 });
  } catch (error) {
    throw new Error("Failed to update the quiz");
  }
};

export const deleteQuiz = async (quizId: string) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("Authentication required to delete quiz.");
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
    const documentRef = doc(userDocRef, "quizzes", quizId);

    await deleteDoc(documentRef).then(async () => {
      // delete the practice quiz and all quiz results
      const deletePractice = deletePracticeQuiz(quizId);
      const deleteResults = deleteQuizResults(quizId);

      await Promise.all([deletePractice, deleteResults]);
    });
  } catch (error) {
    throw new Error("Failed to delete the quiz");
  }
};

export const createQuestion = async (
  quizId: string,
  data: QuestionCreateData
) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Authentication required to create question.");
  }

  if (!user.id) {
    throw new Error("User ID is required");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("User not found");
  }

  const newQuestionData = {
    id: uuidv4(),
    question: data.question,
    answer: data.answer,
    false_answers: data.false_answers,
  };

  try {
    const userDocRef = doc(db, "users", user.id);
    const documentRef = doc(userDocRef, "quizzes", quizId);
    const docSnapshot = await getDoc(documentRef);

    if (!docSnapshot.exists()) {
      throw new Error("Quiz not found");
    }

    const currentQuestions = (docSnapshot.data().questions as Question[]) || [];

    const updatedQuestions = [...currentQuestions, newQuestionData];

    const version = docSnapshot.data().version;

    await updateDoc(documentRef, {
      questions: updatedQuestions,
      version: version + 1,
    });
  } catch (error) {
    throw new Error("Failed to create the question");
  }
};

export const updateQuestion = async (
  quizId: string,
  questionId: string,
  data: QuestionUpdateData
) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Authentication required to update question.");
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
    const documentRef = doc(userDocRef, "quizzes", quizId);
    const docSnapshot = await getDoc(documentRef);

    if (!docSnapshot.exists()) {
      throw new Error("Quiz not found");
    }

    const currentQuestions = (docSnapshot.data().questions as Question[]) || [];

    const updatedQuestions = currentQuestions.map((question) => {
      if (question.id === questionId) {
        return { ...question, ...data };
      }
      return question;
    });

    const version = docSnapshot.data().version;

    await updateDoc(documentRef, {
      questions: updatedQuestions,
      version: version + 1,
    });
  } catch (error) {
    throw new Error("Failed to update the question");
  }
};

export const deleteQuestion = async (quizId: string, questionId: string) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Authentication required to delete question.");
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
    const documentRef = doc(userDocRef, "quizzes", quizId);
    const docSnapshot = await getDoc(documentRef);

    if (!docSnapshot.exists()) {
      throw new Error("Quiz not found");
    }

    const currentQuestions = (docSnapshot.data().questions as Question[]) || [];

    const updatedQuestions = currentQuestions.filter(
      (question) => question.id !== questionId
    );

    await updateDoc(documentRef, { questions: updatedQuestions });
  } catch (error) {
    throw new Error("Failed to delete the question");
  }
};
