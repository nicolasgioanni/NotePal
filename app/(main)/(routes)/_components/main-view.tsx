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
import { useMediaQuery } from "@/hooks/use-media-query";

interface MainViewProps {
  defaultNavCollapsed?: boolean;
  defaultChatCollapsed?: boolean;
  navCollapsedSize: number;
  children: React.ReactNode;
}

export function MainView({
  defaultNavCollapsed = false,
  children,
}: MainViewProps) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(defaultNavCollapsed);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const navRef = useRef<ImperativePanelHandle>(null);

  function handleToggleNav() {
    if (navRef.current) {
      if (navRef.current.isCollapsed()) {
        navRef.current.expand();
      } else {
        navRef.current.collapse();
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
            "group/navbar min-w-[160px] bg-muted/20",
            isNavCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out",
            !isDesktop && "hidden"
          )}
        >
          <div className="flex flex-col h-full px-4 py-5 flex-grow">
            <Sidebar
              isCollapsed={isNavCollapsed}
              onToggleSidebar={handleToggleNav}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle className={cn(!isDesktop && "hidden")} />
        <ResizablePanel defaultSize={80}>{children}</ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
