"use server";
import { Index, Pinecone, RecordMetadata } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { pineconeDB } from "@/db/pinecone/pinecone";
import { PineconeStoreParams } from "@langchain/pinecone";
import { getChunksFromMarkdown } from "./markdown-chunker";

export const generateAndStoreEmbeddings = async (
  docId: string,
  markdown: string
) => {
  console.log("Chunking markdown...");

  const chunks = await getChunksFromMarkdown(markdown);

  console.log("Deleting old embeddings...");

  await deleteEmbeddingsForDoc(docId);

  console.log("Generating and storing embeddings in Pinecone...");

  await PineconeStore.fromDocuments(
    chunks,
    new OpenAIEmbeddings({ modelName: "text-embedding-3-small" }),
    {
      pineconeIndex: pineconeDB,
      namespace: docId,
    }
  );
  console.log("Done!");
};

export const deleteEmbeddingsForDoc = async (docId: string) => {
  const vectorStore = await getVectorStore(docId);
  try {
    await vectorStore.delete({ deleteAll: true });
  } catch (error) {
    console.error("Error deleting embeddings for docId: ", docId);
  }
};

export const getEmbeddingsForDoc = async (docId: string) => {
  const vectorStore = await getVectorStore(docId);

  const embeddings = await vectorStore.embeddings;
  console.log("Embeddings: ", embeddings);

  return embeddings;
};

export async function getVectorStore(namespace?: string) {
  return PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({ modelName: "text-embedding-3-small" }),
    {
      pineconeIndex: pineconeDB,
      ...(namespace && { namespace: namespace }),
    }
  );
}
