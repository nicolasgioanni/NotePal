"use client";

import { useState, useRef } from "react";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ImperativePanelHandle } from "react-resizable-panels";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { DocumentContent } from "./document-content";
import { ChatControl } from "./chat-control";
import { NavControl } from "./nav-control";
import { ChatContent } from "./chat-content";
import { NavContent } from "./nav-content";
import { TooltipProvider } from "@/components/ui/tooltip";

interface MainViewProps {
  defaultLayout: number[] | undefined;
  defaultNavCollapsed?: boolean;
  defaultChatCollapsed?: boolean;
  navCollapsedSize: number;
}

export function MainView({
  defaultLayout = [265, 440, 655],
  defaultNavCollapsed = false,
  defaultChatCollapsed = false,
  navCollapsedSize,
}: MainViewProps) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(defaultNavCollapsed);
  const [isChatCollapsed, setIsChatCollapsed] = useState(defaultChatCollapsed);

  const navRef = useRef<ImperativePanelHandle>(null);
  const chatRef = useRef<ImperativePanelHandle>(null);

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
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible
          minSize={12}
          maxSize={30}
          onCollapse={() => {
            setIsNavCollapsed(true);
            document.cookie = `react-resizable-panels:navCollapsed=${JSON.stringify(
              true
            )}`;
          }}
          onExpand={() => {
            setIsNavCollapsed(false);
            document.cookie = `react-resizable-panels:navCollapsed=${JSON.stringify(
              false
            )}`;
          }}
          className={cn(
            "group/navbar",
            isNavCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div className="flex flex-col h-full px-4 py-5 justify-center">
            <NavControl
              isCollapsed={isNavCollapsed}
              onToggleSidebar={handleToggleNav}
            />
            <Separator />
            <NavContent isCollapsed={isNavCollapsed} />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          defaultSize={defaultLayout[1]}
          minSize={30}
        >
          <div className="h-full px-4 py-5 overflow-x-auto">
            <DocumentContent />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          ref={chatRef}
          defaultSize={defaultLayout[2]}
          collapsedSize={navCollapsedSize}
          collapsible
          minSize={15}
          maxSize={30}
          onCollapse={() => {
            setIsChatCollapsed(true);
            document.cookie = `react-resizable-panels:chatCollapsed=${JSON.stringify(
              true
            )}`;
          }}
          onExpand={() => {
            setIsChatCollapsed(false);
            document.cookie = `react-resizable-panels:chatCollapsed=${JSON.stringify(
              false
            )}`;
          }}
          className={cn(
            "group/chat",
            isChatCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div className="flex flex-col flex-grow h-full px-4 py-5">
            <ChatControl
              isCollapsed={isChatCollapsed}
              onToggleChat={handleToggleChat}
            />
            <Separator />
            <ChatContent isCollapsed={isChatCollapsed} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
