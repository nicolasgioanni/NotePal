import { Separator } from "@/components/ui/separator";
import { ChatControl } from "./chat-control";
import { ChatContent } from "./chat-content";

interface ChatBarProps {
  isChatCollapsed: boolean;
  onToggleChat: () => void;
}

export function ChatBar({ isChatCollapsed, onToggleChat }: ChatBarProps) {
  return (
    <>
      <ChatControl
        isCollapsed={isChatCollapsed}
        onToggleChat={onToggleChat}
      />
      <Separator className="my-3" />
      <ChatContent isCollapsed={isChatCollapsed} />
    </>
  );
}
