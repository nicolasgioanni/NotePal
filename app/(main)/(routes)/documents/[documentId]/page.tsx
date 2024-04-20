"use client";

import { EditorContent } from "@/app/(main)/_components/editor-content";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scroll } from "lucide-react";

const DocumentIdPage = () => {
  const params = useParams();

  return <EditorContent />;
};

export default DocumentIdPage;
