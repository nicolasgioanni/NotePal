"use client";

import { Document } from "@/models/document";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  collection,
  doc,
  DocumentReference,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Title } from "./title";
import { Download, MoreHorizontal, Share } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Actions } from "./actions";

export const Navbar = () => {
  const params = useParams();
  const [document, setDocument] = useState<Document | null>(null);
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait until the authentication state is determined

    if (!user) {
      // If no user is logged in, redirect to the login page
      router.push("/login");
      return;
    }

    if (params.documentId) {
      const docRef = doc(db, "documents", params.documentId as string);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setDocument({
            id: docSnap.id,
            ...docSnap.data(),
          } as Document);
        } else {
          // If the document does not exist, redirect to the documents page
          router.push("/documents");
        }
      });

      return () => unsubscribe(); // Cleanup the listener when the component unmounts or the documentId changes
    }
  }, [params.documentId, router, user, loading]);

  if (!params.documentId) return null;

  return (
    <div className="px-4 pt-5 pb-3 sticky top-0 min-h-16">
      {document ? (
        <div className="flex flex-row justify-between items-center">
          <div className="truncate flex-1">
            <Title initialData={document} />
          </div>
          <div>
            <Actions initialData={document} />
          </div>
        </div>
      ) : (
        <Skeleton className="w-full h-8" />
      )}
    </div>
  );
};
