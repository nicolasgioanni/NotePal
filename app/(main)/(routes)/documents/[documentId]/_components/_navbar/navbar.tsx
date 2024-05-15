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
import { auth, db } from "@/db/firebase/config";
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
import { MobileSidebarButton } from "@/components/mobile-sidebar-button";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { MobileChatbarButton } from "@/components/mobile-chatbar-button";

interface NavbarProps {
  initialData?: Document;
}

export const Navbar = ({ initialData }: NavbarProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (!initialData) return <Navbar.Skeleton />;

  return (
    <div className="px-4 pt-5 pb-3 sticky top-0 min-h-16">
      <div className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-x-4">
          <MobileSidebarButton />
          <div className="truncate flex-1">
            <Title initialData={initialData} />
          </div>
        </div>

        <div className="flex gap-x-2 items-center">
          <Actions initialData={initialData} />
          <MobileChatbarButton />
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
