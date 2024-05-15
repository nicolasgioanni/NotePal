"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Menu } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ProfileDropdown } from "@/app/(main)/(routes)/_components/_sidebar/profile-dropdown";
import { SidebarActions } from "@/app/(main)/(routes)/_components/_sidebar/sidebar-actions";
import { SidebarContent } from "@/app/(main)/(routes)/_components/_sidebar/sidebar-content";

export const MobileSidebarButton = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isDesktop) {
      setOpen(false);
    }
  }, [isDesktop]);

  return (
    <div className={cn(isDesktop && "hidden")}>
      <Sheet
        open={open && !isDesktop}
        onOpenChange={setOpen}
      >
        <SheetTrigger asChild>
          <Button
            size="hug"
            variant="ghost"
            className="p-1 text-muted-foreground"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="sm:max-w-full w-2/3"
          onCloseAutoFocus={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex flex-col">
            <div className="w-fit">
              <ProfileDropdown />
            </div>
            <div className="mt-3">
              <SidebarActions isCollapsed={false} />
            </div>
            <div className="mt-5">
              <SidebarContent isCollapsed={false} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
