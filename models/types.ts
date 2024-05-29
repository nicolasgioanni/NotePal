import { JSONContent } from "novel";

interface Document {
  id?: string;
  title: string;
  userId: string;
  parentFolderId: string | null;
  markdown: string;
  isPublished: boolean;
  createdAt: Date;
}

interface DocumentUpdateData {
  title?: string;
  markdown?: string;
  parentFolderId?: string | null;
  isPublished?: boolean;
}

interface DocumentCreateData {
  title?: string;
  markdown?: string;
  parentFolderId?: string | null;
}

interface Folder {
  id?: string;
  title: string;
  userId: string;
  parentFolderId?: string | null;
  createdAt: Date;
}

interface FolderUpdateData {
  title?: string;
  parentFolderId?: string | null;
}

interface FolderCreateData {
  title?: string;
  parentFolderId?: string | null;
}

interface UserUpdateData {
  name?: string;
  photoURL?: string;
  emailVerified?: Date;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

interface FlashcardUpdateData {
  front?: string;
  back?: string;
}

interface FlashcardCreateData {
  front: string;
  back: string;
}
interface FlashcardDeck {
  id?: string;
  parentFolderId?: string | null;
  title: string;
  userId: string;
  createdAt: Date;
  flashcards: Flashcard[];
}

interface FlashcardDeckCreateData {
  title: string;
  flashcards: Flashcard[];
  parentFolderId?: string | null;
}

interface FlashcardDeckUpdateData {
  title?: string;
  flashcards?: Flashcard[];
  parentFolderId?: string | null;
}

interface FlashcardDeck {
  id?: string;
  parentFolderId?: string | null;
  title: string;
  userId: string;
  createdAt: Date;
  questions: Question[];
}

interface Quiz {
  id?: string;
  parentFolderId?: string | null;
  title: string;
  userId: string;
  createdAt: Date;
  questions: Question[];
  version: number;
}

interface QuizCreateData {
  title: string;
  questions: Question[];
  parentFolderId?: string | null;
}

interface QuizUpdateData {
  title?: string;
  questions?: Question[];
  parentFolderId?: string | null;
}

interface Question {
  id: string;
  question: string;
  answer: string;
  false_answers: string[];
}

interface QuestionCreateData {
  question: string;
  answer: string;
  false_answers: string[];
}

interface QuestionUpdateData {
  question?: string;
  answer?: string;
  false_answers?: string[];
}

interface UserAnswer {
  questionId: string;
  answer: string;
  correct: boolean;
}

interface PracticeQuiz {
  id?: string;
  quizId: string;
  userId: string;
  currentQuestionIndex: number;
  questions: Question[];
  userAnswers: UserAnswer[];
  timeStarted: Date;
}

interface PracticeQuizUpdateData {
  currentQuestionIndex?: number;
  questions?: Question[];
  userAnswers?: UserAnswer[];
  timeStarted?: Date;
}

interface PracticeQuizResult {
  id?: string;
  quizId: string;
  userId: string;
  questions: Question[];
  userAnswers: UserAnswer[];
  dateCreated: Date;
}

export type {
  Document,
  DocumentUpdateData,
  DocumentCreateData,
  Folder,
  FolderUpdateData,
  FolderCreateData,
  UserUpdateData,
  FlashcardDeck,
  FlashcardDeckCreateData,
  FlashcardDeckUpdateData,
  Flashcard,
  FlashcardUpdateData,
  FlashcardCreateData,
  Quiz,
  QuizCreateData,
  QuizUpdateData,
  Question,
  QuestionUpdateData,
  QuestionCreateData,
  PracticeQuiz,
  PracticeQuizUpdateData,
  PracticeQuizResult,
  UserAnswer,
};
