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
          className="px-0"
        >
          <SheetHeader className="px-3">
            <SheetTitle>Edit profile</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};
