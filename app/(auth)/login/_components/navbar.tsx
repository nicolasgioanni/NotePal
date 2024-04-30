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
        "z-50 bg-background fixed top-0 flex items-center w-full py-4 px-6 transition-all duration-100 ease-in min-h-[72px]",
        isScrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
    </div>
  );
};
