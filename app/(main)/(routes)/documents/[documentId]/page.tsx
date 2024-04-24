"use client";

import { EditorContent } from "./_components/editor-content";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scroll } from "lucide-react";

const DocumentIdPage = () => {
  return (
    <>
      <EditorContent />
    </>
  );
};

export default DocumentIdPage;
