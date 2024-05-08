import { SidebarControl } from "./sidebar-control";
import { Separator } from "@/components/ui/separator";
import { SidebarContent } from "./sidebar-content";
import { SidebarActions } from "./sidebar-actions";
import { AddButton } from "./add-button";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function Sidebar({ isCollapsed, onToggleSidebar }: SidebarProps) {
  return (
    <div className="flex flex-col">
      <SidebarControl
        isCollapsed={isCollapsed}
        onToggleSidebar={onToggleSidebar}
      />
      <div className="mt-2">
        <SidebarActions isCollapsed={isCollapsed} />
      </div>
      <div className="mt-4">
        <SidebarContent isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}
