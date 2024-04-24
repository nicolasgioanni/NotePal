import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, MoreHorizontal, Share } from "lucide-react";
import { Publish } from "./publish";
import { Document } from "@/models/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ActionsProps {
  initialData: Document;
}

export const Actions = ({ initialData }: ActionsProps) => {
  return (
    <div className="flex items-center gap-x-2 max-h-8 ml-2">
      <Publish initialData={initialData} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="hug"
            className="p-1 focus:outline-none max-h-8 rounded-md"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="bottom"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <div className="text-muted-foreground flex items-center">
                <Download className="h-4 w-4 mr-2" />
                <span>Download PDF</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
