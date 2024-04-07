"use client";

// util imports
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";

// next imports
import { useRouter } from "next/navigation";
import Link from "next/link";

// ui imports
import { Logo } from "../../../components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const isScrolled = useScrollTop();
  const router = useRouter();

  const handleEnterNotePal = () => {
    router.push("/documents");
  };

  return (
    <div
      className={cn(
        "z-50 bg-background fixed top-0 flex items-center w-screen py-4 px-6 transition-shadow duration-100 ease-in",
        isScrolled && "border-b shadow-sm"
      )}
    >
      <Logo />

      <div className="md:ml-auto md:justify-end w-full flex justify-end items-center">
        <div className="sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 sm:hidden">
              <DropdownMenuLabel>NotePal</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <span>About</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Features</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  onClick={handleEnterNotePal}
                  size="sm"
                  className="w-full"
                >
                  Start Learning
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="hidden sm:flex flex-row gap-x-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem className="text-muted-foreground">
                <Link
                  href="/"
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="text-muted-foreground">
                <Link
                  href="/"
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Features
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Button onClick={handleEnterNotePal}>Start Learning</Button>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};
