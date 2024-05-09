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

interface SidebarControlProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function SidebarControl({
  isCollapsed,
  onToggleSidebar,
}: SidebarControlProps) {
  const { setTheme } = useTheme();
  const loading = false;
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
        <>
          {loading ? (
            <Skeleton className="w-full h-8" />
          ) : (
            <div className="flex w-full overflow-hidden items-center justify-start gap-x-2 rounded-md transition hover:bg-accent hover:cursor-pointer">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex-auto overflow-hidden">
                    <div className="flex items-center justify-start py-1 px-2">
                      <div className="flex flex-col mr-2 overflow-hidden">
                        <div className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                          {user?.name}
                          &apos;s NotePal
                        </div>
                      </div>
                      <div className="flex-grow-0 flex-shrink-0 w-3 h-3">
                        <ChevronsUpDown className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60 ml-4">
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-y-1">
                      <span>{user?.name}&apos;s NotePal</span>
                      <span className="text-xs text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="hover:cursor-pointer text-muted-foreground">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:cursor-pointer text-muted-foreground">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="hover:cursor-pointer text-muted-foreground hover:text-primary">
                        <Sun className="mr-2 h-4 w-4 rotate-0 transition-all dark:-rotate-90 dark:hidden" />
                        <Moon className="mr-2 h-4 w-4 rotate-90 transition-all dark:rotate-0 hidden dark:block" />
                        <span className="sr-only">Toggle theme</span>
                        <span>Theme</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="text-muted-foreground">
                          <DropdownMenuItem
                            className="hover:cursor-pointer hover:bg-accent"
                            onClick={() => setTheme("light")}
                          >
                            <span>Light</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:cursor-pointer hover:bg-accent"
                            onClick={() => setTheme("dark")}
                          >
                            <span>Dark</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="hover:cursor-pointer hover:bg-accent"
                            onClick={() => setTheme("system")}
                          >
                            <span>System</span>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:cursor-pointer text-muted-foreground">
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    <span>Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="hover:cursor-pointer text-muted-foreground"
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </>
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
