interface ChatContentProps {
  isCollapsed: boolean;
}

export function ChatContent({ isCollapsed }: ChatContentProps) {
  if (isCollapsed) {
    return <div className="h-full"></div>;
  }

  return <div className="h-full">Chat Content ( TO BE IMPLEMENTED )</div>;
}
