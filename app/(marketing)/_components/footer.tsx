// ui imports
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export const Footer = () => {
  return (
    <div className="flex flex-col justify-between md:flex-row space-y-4 md:space-y-0 items-center w-full p-6 bg-background z-50">
      <div className="w-full">
        <Logo />
      </div>
      <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
        >
          Privacy Policy
        </Button>
        <Button
          variant="ghost"
          size="sm"
        >
          Terms & Conditions
        </Button>
      </div>
    </div>
  );
};
