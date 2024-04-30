import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
  throw Error(
    "Missing PINECONE_API_KEY - make sure to add it to your .env file."
  );
}

const pinecone = new Pinecone({
  apiKey: apiKey,
});

export const notesIndex = pinecone.index("notepal-chatbot");
