import { auth, db } from "@/firebase/config";
import {
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  writeBatch,
  getDocs,
} from "firebase/firestore";
import {
  DocumentCreateData,
  DocumentUpdateData,
  FolderCreateData,
  FolderUpdateData,
  Document,
  Folder,
} from "@/models/types";
import { defaultEditorContent } from "@/lib/content";

async function checkUserMatch(
  docId: string,
  collectionName: string
): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) throw new Error("Authentication required");

  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error("Document does not exist");

  const document = docSnap.data();
  return document.userId === user.uid;
}

export const updateDocument = async (
  docId: string,
  data: DocumentUpdateData
) => {
  if (!(await checkUserMatch(docId, "documents"))) {
    throw new Error("Unauthorized to modify this document");
  }

  const docRef = doc(db, "documents", docId);
  await updateDoc(docRef, { ...data });
};

export const createDocument = async (data?: DocumentCreateData) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Authentication required to create documents.");

  const defaultData: Document = {
    title: "Untitled",
    userId: user.uid,
    parentFolderId: null,
    content: defaultEditorContent,
    isPublished: false,
  };

  const documentData: Document = { ...defaultData, ...data };
  const collectionRef = collection(db, "documents");
  const docRef = await addDoc(collectionRef, documentData);
  return docRef.id;
};

export const deleteDocument = async (docId: string) => {
  if (!(await checkUserMatch(docId, "documents"))) {
    throw new Error("Unauthorized to delete this document");
  }

  const docRef = doc(db, "documents", docId);
  await deleteDoc(docRef);
};

export const updateFolder = async (
  folderId: string,
  data: FolderUpdateData
) => {
  if (!(await checkUserMatch(folderId, "folders"))) {
    throw new Error("Unauthorized to modify this folder");
  }

  const docRef = doc(db, "folders", folderId);
  await updateDoc(docRef, { ...data });
};

export const createFolder = async (data?: FolderCreateData) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Authentication required to create folders.");

  const defaultData: Folder = {
    title: "Untitled",
    userId: user.uid,
    parentFolderId: null,
  };

  const folderData: Folder = { ...defaultData, ...data };
  const collectionRef = collection(db, "folders");
  const docRef = await addDoc(collectionRef, folderData);
  return docRef.id;
};

export const deleteFolder = async (folderId: string): Promise<void> => {
  if (!(await checkUserMatch(folderId, "folders"))) {
    throw new Error("Unauthorized to delete this folder");
  }

  const batch = writeBatch(db);

  const recursiveDelete = async (folderId: string) => {
    // Handle subfolders
    const subFoldersQuery = query(
      collection(db, "folders"),
      where("userId", "==", auth.currentUser?.uid),
      where("parentFolderId", "==", folderId)
    );
    const subFoldersSnapshot = await getDocs(subFoldersQuery);
    for (const folderDoc of subFoldersSnapshot.docs) {
      await recursiveDelete(folderDoc.id); // Recursive call for subfolders
      batch.delete(folderDoc.ref);
    }

    // Handle documents in the folder
    const documentsQuery = query(
      collection(db, "documents"),
      where("userId", "==", auth.currentUser?.uid),
      where("parentFolderId", "==", folderId)
    );
    const documentsSnapshot = await getDocs(documentsQuery);
    documentsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Finally delete the folder itself
    const folderRef = doc(db, "folders", folderId);
    batch.delete(folderRef);
  };

  await recursiveDelete(folderId);
  await batch.commit().catch((error) => {
    throw new Error(
      "Failed to delete folder and its contents: " + error.message
    );
  });
};
