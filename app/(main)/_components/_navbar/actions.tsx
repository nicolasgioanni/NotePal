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
import { Document } from "@/models/document";

interface ActionsProps {
  initialData: Document;
}

export const Actions = ({ initialData }: ActionsProps) => {
  return (
    <div className="flex items-center gap-x-2">
      <Publish initialData={initialData} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="hug"
            className="p-1 focus:outline-none ml-3"
          >
            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
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
