import { ChatBot } from "./chat-bot";
import { cn } from "@/lib/utils";

interface ChatContentProps {
  isCollapsed: boolean;
}

export function ChatContent({ isCollapsed }: ChatContentProps) {
  return (
    <div className={cn("h-full pt-4", isCollapsed && "hidden")}>
      <ChatBot />
    </div>
  );
}
