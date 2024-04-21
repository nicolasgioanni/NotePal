import { SidebarControl } from "./sidebar-control";
import { Separator } from "@/components/ui/separator";
import { SidebarContent } from "./sidebar-content";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function Sidebar({ isCollapsed, onToggleSidebar }: SidebarProps) {
  return (
    <>
      <SidebarControl
        isCollapsed={isCollapsed}
        onToggleSidebar={onToggleSidebar}
      />
      <Separator className="my-3" />
      <SidebarContent isCollapsed={isCollapsed} />
    </>
  );
}
