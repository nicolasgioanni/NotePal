"use server";

import { currentUser } from "@/lib/auth";
import { FolderCreateData, FolderUpdateData } from "@/models/types";

import { db } from "@/db/firebase/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { getUserById } from "./user";

export const createFolder = async (data?: FolderCreateData) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Authentication required to create folders.");
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
    createdAt: new Date(),
  };

  // Create a new document in the documents collection for the user in the users collection
  try {
    const userDocRef = doc(db, "users", user.id);
    const foldersCollectionRef = collection(userDocRef, "folders");
    const docRef = await addDoc(foldersCollectionRef, defaultData);
    return docRef.id;
  } catch (error) {
    throw new Error("Failed to create a new folder");
  }
};

export const updateFolder = async (docId: string, data: FolderUpdateData) => {
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

  try {
    const userDocRef = doc(db, "users", user.id);
    const folderRef = doc(userDocRef, "folders", docId);
    await updateDoc(folderRef, { ...data });
  } catch (error) {
    throw new Error("Failed to update the folder");
  }
};

export const deleteFolder = async (folderId: string): Promise<void> => {
  const user = await currentUser();
  if (!user) {
    throw new Error("Authentication required to delete folders.");
  }
  if (!user.id) {
    throw new Error("User ID is required");
  }
  const userRef = doc(db, "users", user.id);
  const folderRef = doc(userRef, "folders", folderId);

  const batch = writeBatch(db);

  const recursiveDelete = async (folderId: string) => {
    // Handle subfolders
    const subFoldersQuery = query(
      collection(userRef, "folders"),
      where("parentFolderId", "==", folderId)
    );
    const subFoldersSnapshot = await getDocs(subFoldersQuery);
    for (const folderDoc of subFoldersSnapshot.docs) {
      await recursiveDelete(folderDoc.id); // Recursive call for subfolders
      batch.delete(folderDoc.ref);
    }

    // Handle documents in the folder
    const documentsQuery = query(
      collection(userRef, "documents"),
      where("parentFolderId", "==", folderId)
    );
    const documentsSnapshot = await getDocs(documentsQuery);
    documentsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    batch.delete(folderRef);
  };

  await recursiveDelete(folderId);
  await batch.commit().catch((error) => {
    throw new Error(
      "Failed to delete folder and its contents: " + error.message
    );
  });
};
