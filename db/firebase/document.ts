"use server";

import { currentUser } from "@/lib/auth";
import {
  Document,
  DocumentCreateData,
  DocumentUpdateData,
} from "@/models/types";
import {
  schema,
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from "prosemirror-markdown";

import { db } from "@/db/firebase/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  runTransaction,
  getDoc,
} from "firebase/firestore";
import { getUserById } from "./user";
import { getEmbedding } from "@/lib/openai";
import { JSONContent } from "novel";
import { pineconeDB } from "../pinecone/pinecone";
import { Node } from "prosemirror-model";
import {
  deleteEmbeddingsForDoc,
  generateAndStoreEmbeddings,
} from "@/lib/vector-store";
import { getChunksFromMarkdown } from "@/lib/markdown-chunker";

export const getDocumentById = async (docId: string) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("Authentication required to get documents.");
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
    const documentRef = doc(userDocRef, "documents", docId);

    const documentSnapshot = await getDoc(documentRef);

    if (!documentSnapshot.exists()) {
      throw new Error("Document not found");
    }

    const documentData = documentSnapshot.data() as Document;

    return JSON.stringify(documentData);
  } catch (error) {
    throw new Error("Failed to get document");
  }
};

export const createDocument = async (data?: DocumentCreateData) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Authentication required to create documents.");
  }

  if (!user.id) {
    throw new Error("User ID is required");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("User not found");
  }

  const defaultData = {
    title: data?.title || "Untitled",
    userId: user.id,
    parentFolderId: data?.parentFolderId || null,
    markdown: "",
    isPublished: false,
    createdAt: new Date(),
  };

  // Create a new document in the documents collection for the user in the users collection
  try {
    const userDocRef = doc(db, "users", user.id);
    const documentsCollectionRef = collection(userDocRef, "documents");

    // const embedding = await getEmbeddingForDoc(defaultData.title);

    const docRefId = await addDoc(documentsCollectionRef, defaultData).then(
      async (docRef) => {
        console.log("Document written with ID: ", docRef.id);

        return docRef.id;
      }
    );
    return docRefId;
  } catch (error) {
    throw new Error("Failed to create a new document");
  }
};

export const updateDocument = async (
  docId: string,
  data: DocumentUpdateData
) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Authentication required to update documents.");
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
    const documentRef = doc(userDocRef, "documents", docId);

    await updateDoc(documentRef, { ...data });
  } catch (error) {
    throw new Error("Failed to update the document");
  }
};

export const deleteDocument = async (docId: string) => {
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
    const documentRef = doc(userDocRef, "documents", docId);

    // Perform Firestore document deletion within a transaction
    await runTransaction(db, async (transaction) => {
      await transaction.delete(documentRef);
      await deleteEmbeddingsForDoc(docId);
    });
  } catch (error) {
    throw new Error("Failed to delete document");
  }
};

export const updateDocumentContent = async (
  docId: string,
  markdown: string
) => {
  await updateDocument(docId, {
    markdown: markdown,
  });
};
