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
    <>
      <div className="px-4">
        <ChatControl
          isCollapsed={isChatCollapsed}
          onToggleChat={onToggleChat}
        />
      </div>
      <ChatContent isCollapsed={isChatCollapsed} />
    </>
  );
}
