//firebase imports
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";

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
import { useEffect } from "react";

interface NavControlProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function NavControl({ isCollapsed, onToggleSidebar }: NavControlProps) {
  const { setTheme } = useTheme();
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    console.log(user);
  }, [user]);

  function handleLogOut() {
    console.log("Logout clicked");
    router.push("/logout");
  }

  if (isCollapsed) {
    return (
      <div className="flex justify-center pb-4">
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
                          {user
                            ? user.displayName
                              ? user.displayName
                              : user.email
                            : "User"}
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
                      <span>
                        {user
                          ? user.displayName
                            ? user.displayName
                            : user.email
                          : "User"}
                        &apos;s NotePal
                      </span>
                      {user ? (
                        <span className="font-normal text-sm text-muted-foreground">
                          {user.email}
                        </span>
                      ) : null}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="hover:cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="hover:cursor-pointer">
                        <Sun className="mr-2 h-4 w-4 rotate-0 transition-all dark:-rotate-90 dark:hidden" />
                        <Moon className="mr-2 h-4 w-4 rotate-90 transition-all dark:rotate-0 hidden dark:block" />
                        <span className="sr-only">Toggle theme</span>
                        <span>Theme</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
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
                  <DropdownMenuItem className="hover:cursor-pointer">
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    <span>Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="hover:cursor-pointer"
                    onClick={handleLogOut}
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
