"use client";

import { Document } from "@/models/types";
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
import { useDocumentById } from "@/hooks/use-document-by-id";

interface NavbarProps {
  initialData: Document;
}

export const Navbar = ({ initialData }: NavbarProps) => {
  return (
    <div className="px-4 pt-5 pb-3 sticky top-0 min-h-16">
      <div className="flex flex-row justify-between items-center">
        <div className="truncate flex-1">
          <Title initialData={initialData} />
        </div>
        <div>
          <Actions initialData={initialData} />
        </div>
      </div>
    </div>
  );
};

Navbar.Skeleton = function NavbarSkeleton() {
  return (
    <div className="px-4 pt-5 pb-3 sticky top-0 min-h-16">
      <Skeleton className="h-8 w-full" />
    </div>
  );
};
