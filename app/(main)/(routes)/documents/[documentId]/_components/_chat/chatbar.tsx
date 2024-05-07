import { Separator } from "@/components/ui/separator";
import { ChatControl } from "./chat-control";
import { ChatContent } from "./chat-content";
import { Document } from "@/models/types";

interface ChatBarProps {
  isChatCollapsed: boolean;
  onToggleChat: () => void;
}

export function ChatBar({ isChatCollapsed, onToggleChat }: ChatBarProps) {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col px-4 pt-5">
        <ChatControl
          isCollapsed={isChatCollapsed}
          onToggleChat={onToggleChat}
        />
        <Separator className="my-3" />
      </div>
      <ChatContent isCollapsed={isChatCollapsed} />
    </div>
  );
}
