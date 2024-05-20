"use client";

import { Separator } from "@/components/ui/separator";
import { SearchButton } from "../../_components/search-button";
import { DocumentsList } from "../../_components/documents-list";
import { AddButton } from "../../_components/add-button";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const DashboardDocs = () => {
  return (
    <div className="flex flex-col gap-y-6 mt-8 h-full">
      <SearchButton variant="outline" />
      <div className="flex flex-col gap-y-2">
        <div className="flex justify-between items-center text-muted-foreground">
          <span className="font-medium">Documents</span>
          <AddButton
            button={
              <Button
                variant="ghost"
                size="hug"
                className="p-1"
              >
                <Plus className="w-4 h-4" />
              </Button>
            }
          />
        </div>
        <Separator />
        <DocumentsList />
      </div>
    </div>
  );
};
