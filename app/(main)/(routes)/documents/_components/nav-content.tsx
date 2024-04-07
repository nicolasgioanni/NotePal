interface NavContentProps {
  isCollapsed: boolean;
}

export function NavContent({ isCollapsed }: NavContentProps) {
  if (isCollapsed) {
    return <div className="h-full"></div>;
  }

  return <div className="h-full">Nav Contents</div>;
}
