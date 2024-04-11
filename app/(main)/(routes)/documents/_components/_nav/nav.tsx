import { cn } from "@/lib/utils";
import { NavControl } from "./nav-control";
import { Separator } from "@/components/ui/separator";
import { NavContent } from "./nav-content";
import { Item } from "../item";
import { PlusCircle } from "lucide-react";

interface NavProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function Nav({ isCollapsed, onToggleSidebar }: NavProps) {
  return (
    <>
      <NavControl
        isCollapsed={isCollapsed}
        onToggleSidebar={onToggleSidebar}
      />
      <Separator className="my-3" />
      <NavContent isCollapsed={isCollapsed} />
    </>
  );
}
