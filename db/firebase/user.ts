import { db } from "@/db/firebase/config";
import { currentUser } from "@/lib/auth";
import { UserUpdateData } from "@/models/types";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const getUserById = async (userId: string) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data();
};

export const getUserByEmail = async (email: string) => {
  const querySnapshot = await getDocs(
    query(collection(db, "users"), where("email", "==", email))
  );
  if (querySnapshot.empty) return null;
  const user = querySnapshot.docs[0].data();
  return user;
};

export const updateUser = async (data: UserUpdateData) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Authentication required to update user data.");
  }

  if (!user.id) {
    throw new Error("User ID is required");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    throw new Error("User not found");
  }

  const userRef = doc(db, "users", user.id);
  await updateDoc(userRef, { ...data });
};

export const updateUserById = async (userId: string, data: UserUpdateData) => {
  const dbUser = await getUserById(userId);

  if (!dbUser) {
    throw new Error("User not found");
  }

  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { ...data });
};
