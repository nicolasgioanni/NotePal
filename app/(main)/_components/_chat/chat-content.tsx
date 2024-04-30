import { ChatBot } from "./chat-bot";

interface ChatContentProps {
  isCollapsed: boolean;
}

export function ChatContent({ isCollapsed }: ChatContentProps) {
  if (isCollapsed) {
    return <div className="h-full"></div>;
  }

  return <ChatBot />;
}
