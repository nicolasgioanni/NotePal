import { auth } from "@/auth";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { getDocumentById } from "@/db//firebase/document";
import { Document } from "@/models/types";
import { createFlashcardDeck } from "@/db/firebase/flashcards";

const openai = new OpenAI();

export const POST = auth(async function GET(req) {
  if (!req.auth || !req.auth.user || !req.auth.user.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    let flashcardDeck;

    if (body.type === "note") {
      // handle generation from note content
      flashcardDeck = await generateFlashcardsFromNote(
        body.noteId,
        body.cardQuantity
      );
    } else if (body.type === "custom") {
      // handle generation from custom topic
      flashcardDeck = await generateFlashcardsFromTopic(
        body.topic,
        body.cardQuantity
      );
    } else {
      return Response.json({ error: "Invalid request type" }, { status: 400 });
    }

    if (!flashcardDeck) {
      return Response.json(
        { error: "Failed to generate flashcards" },
        { status: 500 }
      );
    }

    const deckId = await createFlashcardDeck({
      title: flashcardDeck.title,
      flashcards: flashcardDeck.flashcards,
    });

    return Response.json({ success: true, deckId }, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "Failed to generate flashcards" },
      { status: 500 }
    );
  }
});

async function generateFlashcardsFromNote(
  noteId: string,
  cardQuantity: number
) {
  console.log("Generating flashcards from note", noteId, cardQuantity);

  const noteString = await getDocumentById(noteId);
  const note = JSON.parse(noteString) as Document;
  const markdownContent = note.markdown;

  const messages = [
    {
      role: "system",
      content:
        "You are an AI flashcard generator. Based on the provided markdown content, generate valid JSON output that represents flashcards for the markdown content" +
        "The response should have a title relevant to the content of the flashcards" +
        "Each flashcard should consist of a front and an back. " +
        "The front and back should be concise, with the front ideally not exceeding 75 characters, and the back ideally not exceeding 50 characters. " +
        "Use concise and clear language suitable for educational purposes. " +
        "You must generate the exact quantity of flashcards requested. " +
        "If the quantity of flashcards requested is 0, automatically determine the appropriate number of flashcards to create, up to a maximum of 20." +
        "Provide output in valid JSON format. The data schema should be like this: " +
        JSON.stringify(example_json),
    },
    {
      role: "user",
      content: `The markdown content is is\n: ${markdownContent}\n\n. The quantity of flashcards is: ${cardQuantity}.`,
    },
  ] as ChatCompletionMessageParam[];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
    messages,
  });

  const deckResponse = response.choices[0].message.content;
  if (deckResponse !== null) {
    return JSON.parse(deckResponse);
  }
  return null;
}

async function generateFlashcardsFromTopic(
  topic: string,
  cardQuantity: number
) {
  const messages = [
    {
      role: "system",
      content:
        "You are an AI flashcard generator. Based on the provided topic, generate valid JSON output that represents flashcards" +
        "The response should have a title relevant to the content of the flashcards" +
        "Each flashcard should consist of a front and an back. " +
        "The front and back should be concise, with the front ideally not exceeding 75 characters, and the back ideally not exceeding 50 characters. " +
        "Use concise and clear language suitable for educational purposes. " +
        "You must generate the exact quantity of flashcards requested. " +
        "If the quantity of flashcards requested is 0, automatically determine the appropriate number of flashcards to create, up to a maximum of 20." +
        "Provide output in valid JSON format. The data schema should be like this: " +
        JSON.stringify(example_json),
    },
    {
      role: "user",
      content: `The topic is: "${topic}\n\n". The quantity of flashcards is: ${cardQuantity}.`,
    },
  ] as ChatCompletionMessageParam[];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
    messages,
  });

  const deckResponse = response.choices[0].message.content;
  if (deckResponse !== null) {
    return JSON.parse(deckResponse);
  }
  return null;
}

const example_json = {
  title: "Country Capital Flashcards",
  flashcards: [
    {
      front: "What is the capital of France?",
      back: "Paris",
    },
    {
      front: "What is the capital of Spain?",
      back: "Madrid",
    },
  ],
};
