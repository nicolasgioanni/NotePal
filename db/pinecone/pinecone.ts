import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;
console.log(apiKey);

if (!apiKey) {
  throw Error(
    "Missing PINECONE_API_KEY - make sure to add it to your .env file."
  );
}

const pinecone = new Pinecone({
  apiKey: apiKey,
});

export default pinecone;

export const pineconeDB = pinecone.index("notepal-chatbot");
