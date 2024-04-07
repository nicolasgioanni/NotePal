import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight, Menu } from "lucide-react";

const NavHeader = ({
  onToggleSidebar,
  isExpanded = true,
}: {
  onToggleSidebar: () => void;
  isExpanded: boolean | undefined;
}) => {
  if (isExpanded) {
    return (
      <div className="flex flex-row justify-between pb-4">
        <span className="font-bold text-xl">NotePal</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground 
          rounded-sm opacity-0 group-hover/sidebar:opacity-100 transition z-[99999]"
          onClick={onToggleSidebar}
        >
          <ChevronsLeft className="w-6 h-6" />
        </Button>
      </div>
    );
  } else {
    return (
      <div className="flex flex-row justify-center pb-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative h-6 w-6 text-muted-foreground 
            rounded-sm transition z-[99999] group/expand"
          onClick={onToggleSidebar}
        >
          <Menu className="absolute inset-0 w-6 h-6 transition-opacity duration-300 opacity-100 group-hover/expand:opacity-0" />
          <ChevronsRight className="absolute inset-0 w-6 h-6 transition-opacity duration-300 opacity-0 group-hover/expand:opacity-100" />
        </Button>
      </div>
    );
  }
};

export default NavHeader;
