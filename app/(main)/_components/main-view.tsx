"use client";

import { useState, useRef } from "react";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ImperativePanelHandle } from "react-resizable-panels";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DefaultContent } from "./default-content";
import { Sidebar } from "./_sidebar/sidebar";
import { ChatBar } from "./_chat/chatbar";
import { EditorContent } from "./editor-content";
import { useParams } from "next/navigation";
import { Navbar } from "./_navbar/navbar";
import { Separator } from "@/components/ui/separator";

interface MainViewProps {
  defaultNavCollapsed?: boolean;
  defaultChatCollapsed?: boolean;
  navCollapsedSize: number;
  children: React.ReactNode;
}

export function MainView({
  defaultNavCollapsed = false,
  defaultChatCollapsed = false,
  navCollapsedSize,
  children,
}: MainViewProps) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(defaultNavCollapsed);
  const [isChatCollapsed, setIsChatCollapsed] = useState(defaultChatCollapsed);

  const navRef = useRef<ImperativePanelHandle>(null);
  const chatRef = useRef<ImperativePanelHandle>(null);
  const params = useParams();

  function handleToggleNav() {
    if (navRef.current) {
      if (navRef.current.isCollapsed()) {
        navRef.current.expand();
      } else {
        navRef.current.collapse();
      }
    }
  }

  function handleToggleChat() {
    if (chatRef.current) {
      if (chatRef.current.isCollapsed()) {
        chatRef.current.expand();
      } else {
        chatRef.current.collapse();
      }
    }
  }

  return (
    <TooltipProvider delayDuration={400}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel
          ref={navRef}
          defaultSize={20}
          collapsedSize={navCollapsedSize}
          collapsible
          minSize={12}
          maxSize={30}
          onCollapse={() => {
            setIsNavCollapsed(true);
          }}
          onExpand={() => {
            setIsNavCollapsed(false);
          }}
          className={cn(
            "group/navbar",
            isNavCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div className="flex flex-col h-full px-4 py-5 justify-center">
            <Sidebar
              isCollapsed={isNavCollapsed}
              onToggleSidebar={handleToggleNav}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <Navbar />
          {children}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          ref={chatRef}
          defaultSize={20}
          collapsedSize={navCollapsedSize}
          collapsible
          minSize={15}
          maxSize={30}
          onCollapse={() => {
            setIsChatCollapsed(true);
          }}
          onExpand={() => {
            setIsChatCollapsed(false);
          }}
          className={cn(
            "group/chat",
            isChatCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div className="flex flex-col flex-grow h-full px-4 py-5">
            <ChatBar
              isChatCollapsed={isChatCollapsed}
              onToggleChat={handleToggleChat}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
