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
import { Sidebar } from "./_sidebar/sidebar";
import { ChatBar } from "./_chat/chatbar";

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
        <ResizablePanel defaultSize={80}>{children}</ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
