import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config"; // Ensure you've correctly set up and exported your Firestore instance
import { auth } from "@/firebase/config"; // Ensure you've correctly set up and exported your auth instance
import { Document } from "@/models/document";
import { Folder } from "@/models/folder";
import { Item } from "../item";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NavContentProps {
  isCollapsed: boolean;
}

export function NavContent({ isCollapsed }: NavContentProps) {
  const [user, loading, error] = useAuthState(auth);
  const [documents, setDocuments] = useState<Document[]>([]);

  const handleCreateDocument = () => {
    if (!user) return;

    const newDocument: Document = {
      title: "Untitled",
      userId: user.uid,
      isArchived: false,
      content: "",
      isPublished: false,
    };

    const docRef = doc(collection(db, "documents"));
    const promise = setDoc(docRef, newDocument);

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "Note created!",
      error: "Failed to create a new note.",
    });
  };

  useEffect(() => {
    if (loading) return;

    if (user) {
      const q = query(
        collection(db, "documents"),
        where("userId", "==", user.uid)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const docs: Document[] = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id } as Document);
        });
        setDocuments(docs);
      });

      return () => unsubscribe();
    }
  }, [user, loading]);

  if (isCollapsed) {
    return <div className="h-full"></div>;
  }

  return (
    <div className="h-full flex flex-col gap-y-2">
      <Button
        size="sm"
        variant="outline"
        className="w-full justify-center text-left text-muted-foreground hover:text-muted-foreground gap-x-[6px]"
        onClick={handleCreateDocument}
      >
        <span className="truncate">Create Notes</span>
        <PlusCircle size={16} />
      </Button>
      <Item
        label="Search"
        icon={Search}
        isSearch
        onClick={() => console.log("Search clicked")}
      />
      {documents.map((doc) => (
        <div key={doc.id}>{doc.title}</div>
      ))}
    </div>
  );
}
