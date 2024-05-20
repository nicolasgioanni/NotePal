import { auth } from "@/auth";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { getDocumentById } from "@/db//firebase/document";
import { Document } from "@/models/types";
import { createQuiz } from "@/db/firebase/quiz";
import { v4 as uuidv4 } from "uuid";
import { Question } from "@/models/types";

const openai = new OpenAI();

export const POST = auth(async function GET(req) {
  if (!req.auth || !req.auth.user || !req.auth.user.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    let quiz;

    if (body.type === "note") {
      // handle generation from note content
      quiz = await generateQuizFromNote(body.noteId, body.questionQuantity);
    } else if (body.type === "custom") {
      // handle generation from custom topic
      quiz = await generateQuizFromTopic(body.topic, body.questionQuantity);
    } else {
      return Response.json({ error: "Invalid request type" }, { status: 400 });
    }

    if (!quiz) {
      return Response.json(
        { error: "Failed to generate quiz" },
        { status: 500 }
      );
    }

    const questions = quiz.questions.map(
      (question: {
        question: string;
        answer: string;
        false_answers: string[];
      }) => {
        // turn each flashcard into a Flashcard model
        return {
          id: uuidv4(),
          question: question.question,
          answer: question.answer,
          false_answers: question.false_answers,
        };
      }
    ) as Question[];

    console.log("Generated quiz", quiz, questions);

    const quizId = await createQuiz({
      title: quiz.title,
      questions: questions,
    });

    return Response.json({ success: true, quizId }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
});

async function generateQuizFromNote(noteId: string, questionQuantity: number) {
  console.log("Generating quiz from note", noteId, questionQuantity);

  const noteString = await getDocumentById(noteId);
  const note = JSON.parse(noteString) as Document;
  const markdownContent = note.markdown;

  const messages = [
    {
      role: "system",
      content:
        "You are an AI quiz generator. Based on the provided markdown content, generate valid JSON output that represents quiz questions for the markdown content" +
        "The response should have a title relevant to the content of the quiz" +
        "Each question should consist of a question, answer, and up to 4 false answers. " +
        "You may include a mix of true/false questions and multiple choice questions. " +
        "The questions and answers should be concise, with the question ideally not exceeding 125 characters, and the answers ideally not exceeding 75 characters. " +
        "Use concise and clear language suitable for educational purposes. " +
        "You MUST generate the exact quantity of questions requested. " +
        "If the quantity of questions requested is 0, automatically determine the appropriate number of questions to create, up to a maximum of 20." +
        "Provide output in valid JSON format. The data schema should be like this: " +
        JSON.stringify(example_json),
    },
    {
      role: "user",
      content: `The markdown content is is\n: ${markdownContent}\n\n. The quantity of flashcards is: ${questionQuantity}.`,
    },
  ] as ChatCompletionMessageParam[];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
    messages,
  });

  const quizResponse = response.choices[0].message.content;
  if (quizResponse !== null) {
    return JSON.parse(quizResponse);
  }
  return null;
}

async function generateQuizFromTopic(topic: string, questionQuantity: number) {
  const messages = [
    {
      role: "system",
      content:
        "You are an AI quiz generator. Based on the provided topic, generate valid JSON output that represents quiz questions" +
        "The response should have a title relevant to the content of the quiz" +
        "Each question should consist of a question, answer, and an array of up to 4 false answers. " +
        "You may include a mix of true/false questions and multiple choice questions. " +
        "The questions and answers should be concise, with the question ideally not exceeding 125 characters, and the answers ideally not exceeding 75 characters. " +
        "Use concise and clear language suitable for educational purposes. " +
        "You MUST generate the exact quantity of questions requested. " +
        "If the quantity of questions requested is 0, automatically determine the appropriate number of questions to create, up to a maximum of 20." +
        "Provide output in valid JSON format. The data schema should be like this: " +
        JSON.stringify(example_json),
    },
    {
      role: "user",
      content: `The topic is: "${topic}\n\n". The quantity of flashcards is: ${questionQuantity}.`,
    },
  ] as ChatCompletionMessageParam[];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
    messages,
  });

  const quizResponse = response.choices[0].message.content;
  if (quizResponse !== null) {
    return JSON.parse(quizResponse);
  }
  return null;
}

const example_json = {
  title: "Country Capitals",
  questions: [
    {
      question: "What is the capital of France?",
      answer: "Paris",
      false_answers: ["London", "Berlin", "Madrid", "Rome"],
    },
    {
      question: "Is Madrid the capital of Spain?",
      answer: "True",
      false_answers: ["False"],
    },
    {
      question: "Is London the capital of Germany?",
      answer: "False",
      false_answers: ["True"],
    },
    {
      question: "What is the capital of Italy?",
      answer: "Rome",
      false_answers: ["Paris", "Madrid"],
    },
  ],
};
