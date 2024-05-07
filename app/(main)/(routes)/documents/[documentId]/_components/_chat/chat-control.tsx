import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight, Menu } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatControlProps {
  isCollapsed: boolean;
  onToggleChat: () => void;
}

export function ChatControl({ isCollapsed, onToggleChat }: ChatControlProps) {
  if (isCollapsed) {
    return (
      <div className="flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="hug"
              className="p-1 group/expandButton"
              onClick={onToggleChat}
            >
              <Menu className="text-muted-foreground w-6 h-6 group-hover/expandButton:hidden" />
              <ChevronsLeft className="text-muted-foreground w-6 h-6 hidden group-hover/expandButton:block" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open Chat</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  } else {
    return (
      <div className="flex justify-start items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="hug"
              className="p-1"
              onClick={onToggleChat}
            >
              <ChevronsRight className="opacity-50 h-6 w-6 py-0 px-0" />
              <h1 className="pr-2 pl-1 font-semibold text-base">Chat</h1>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Close Chat</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }
}
