import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { Folder } from "@/models/types";

export const useFolders = (parentFolderId?: string | null) => {
  const [user, loading, authError] = useAuthState(auth);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(authError);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setIsLoading(false);
      setError(new Error("User not authenticated"));
      return;
    }

    const folderQuery = query(
      collection(db, "folders"),
      where("userId", "==", user.uid),
      where("parentFolderId", "==", parentFolderId || null)
    );

    const unsubscribe = onSnapshot(
      folderQuery,
      (querySnapshot) => {
        const loadedFolders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Folder),
        }));
        setFolders(loadedFolders);
        setIsLoading(false);
      },
      (fetchError) => {
        console.error("Error fetching folders:", fetchError);
        setError(fetchError);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, loading, parentFolderId]);

  return { folders, isLoading, error };
};
