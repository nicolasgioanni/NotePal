"use client";

// util imports
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";

//ui imports
import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";

export const Navbar = () => {
  const isScrolled = useScrollTop();
  return (
    <div
      className={cn(
        "z-50 bg-background fixed top-0 flex items-center w-full py-4 px-6 transition-all duration-100 ease-in",
        isScrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end w-full flex justify-end items-center gap-x-2">
        <ModeToggle />
      </div>
    </div>
  );
};
