import { db } from "@/firebase/config";
import {
  doc,
  getDoc,
  updateDoc,
  DocumentData,
  FirestoreError,
} from "firebase/firestore";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";

const getCurrentUserId = () => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      return user.uid;
    } else {
      return null;
    }
  });
};

// Fetch a document
export const getDoc = async (docId) => {
  const docRef = doc(db, "documents", docId);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Document does not exist!");
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};

// Update a document
export const updateDoc = async (docId, data) => {
  const docRef = doc(db, "documents", docId);
  try {
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

// Add a new document
export const createDoc = async (collectionPath, data) => {
  const collectionRef = collection(db, collectionPath);
  try {
    const docRef = await addDoc(collectionRef, data);
    return docRef.id; // Return the new document's ID
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

// Delete a document
export const deleteDoc = async (docId) => {
  const docRef = doc(db, "documents", docId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

export const getFolder = async (folderId) => {};

export const updateFolder = async (folderId, data) => {};

export const createFolder = async (data) => {};

export const deleteFolder = async (folderId) => {};
