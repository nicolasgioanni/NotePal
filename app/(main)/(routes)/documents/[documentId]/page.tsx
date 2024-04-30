"use client";

import { EditorContent } from "./_components/editor-content";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scroll } from "lucide-react";
import { useState } from "react";
import { ResizablePanelGroup } from "@/components/ui/resizable";

const DocumentIdPage = () => {
  return (
    <div>
      <EditorContent />
    </div>
  );
};

export default DocumentIdPage;
