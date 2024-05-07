"use client";
import { Navbar } from "./_components/_navbar/navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDocumentById } from "@/hooks/use-document-by-id";
import { redirect, useParams, useRouter } from "next/navigation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useRef, useState } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { cn } from "@/lib/utils";
import { ChatBar } from "@/app/(main)/(routes)/documents/[documentId]/_components/_chat/chatbar";

const EditorLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const { document, isLoading, error } = useDocumentById(
    params.documentId as string
  );
  const router = useRouter();
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);

  const chatRef = useRef<ImperativePanelHandle>(null);

  function handleToggleChat() {
    if (chatRef.current) {
      if (chatRef.current.isCollapsed()) {
        chatRef.current.expand();
      } else {
        chatRef.current.collapse();
      }
    }
  }

  if (!document && !isLoading) {
    redirect("/documents");
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={80}>
        <div className="h-full flex flex-col w-full">
          {isLoading ? <Navbar.Skeleton /> : <Navbar initialData={document!} />}

          <ScrollArea>
            <main className="h-full px-8">{children}</main>
          </ScrollArea>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        ref={chatRef}
        defaultSize={20}
        collapsedSize={4}
        collapsible
        minSize={20}
        maxSize={70}
        onCollapse={() => {
          setIsChatCollapsed(true);
        }}
        onExpand={() => {
          setIsChatCollapsed(false);
        }}
        className={cn(
          "group/chat min-w-[275px]",
          isChatCollapsed &&
            "min-w-[50px] transition-all duration-300 ease-in-out"
        )}
      >
        <div className="flex flex-col flex-grow h-full">
          <ChatBar
            isChatCollapsed={isChatCollapsed}
            onToggleChat={handleToggleChat}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default EditorLayout;
