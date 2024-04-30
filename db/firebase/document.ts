"use server";

import { currentUser } from "@/lib/auth";
import { DocumentCreateData, DocumentUpdateData } from "@/models/types";

import { db } from "@/db/firebase/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getUserById } from "./user";
import { getEmbedding } from "@/lib/openai";
import { JSONContent } from "novel";

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
    content: data?.content || null,
    isPublished: false,
    createdAt: new Date(),
  };

  // const embedding = await getEmbeddingForDoc(
  //   defaultData.title,
  //   defaultData.content
  // );

  // Create a new document in the documents collection for the user in the users collection
  try {
    const userDocRef = doc(db, "users", user.id);
    const documentsCollectionRef = collection(userDocRef, "documents");
    const docRef = await addDoc(documentsCollectionRef, defaultData);
    return docRef.id;
  } catch (error) {
    throw new Error("Failed to create a new document");
  }
};

export const updateDocument = async (
  docId: string,
  data: DocumentUpdateData
) => {
  console.log("inside function");

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
    await deleteDoc(documentRef);
  } catch (error) {
    throw new Error("Failed to delete the document");
  }
};

async function getEmbeddingForDoc(title: string, content: JSONContent | null) {
  return getEmbedding(title + "\n\n" + content ?? "");
}

export const testFunction = async (data: string) => {
  console.log(JSON.parse(data));
};

export const updateDocumentContent = async (docId: string, content: string) => {
  const json = JSON.parse(content);

  await updateDocument(docId, { content: json });
};
