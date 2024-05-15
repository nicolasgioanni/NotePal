//firebase imports
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Menu,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  LogOut,
  Sun,
  Moon,
  User,
  LifeBuoy,
  Settings,
} from "lucide-react";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ProfileDropdown } from "./profile-dropdown";

interface SidebarControlProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function SidebarControl({
  isCollapsed,
  onToggleSidebar,
}: SidebarControlProps) {
  const { setTheme } = useTheme();
  const user = useCurrentUser();

  if (isCollapsed) {
    return (
      <div className="flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="hug"
              className="group/expandButton p-1"
              onClick={onToggleSidebar}
            >
              <Menu className="text-muted-foreground w-6 h-6 group-hover/expandButton:hidden" />
              <ChevronsRight className="text-muted-foreground w-6 h-6 hidden group-hover/expandButton:block" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open Sidebar</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-x-1">
        <ProfileDropdown />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="hug"
              className="p-1 opacity-0 group-hover/navbar:opacity-100 transition"
              onClick={onToggleSidebar}
            >
              <ChevronsLeft className="opacity-100 text-muted-foreground h-6 w-6 py-0 px-0" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Close Sidebar</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }
}
