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
          setDocument(docSnap.data() as Document);
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
        <div className="flex justify-between items-center">
          <Title docId={params.documentId as string} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="hug"
                className="p-1 focus:outline-none ml-3"
              >
                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer group/delete">
                  <div className="text-muted-foreground flex items-center">
                    <Share className="h-4 w-4 mr-2" />
                    <span>Share</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <div className="text-muted-foreground flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    <span>Download PDF</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Skeleton className="w-full h-8" />
      )}
    </div>
  );
};
