"use client";

import { Separator } from "@/components/ui/separator";
import { DashboardDocList } from "./dashboard-doc-list";
import { SearchButton } from "../../_components/search-button";

export const DashboardDocs = () => {
  return (
    <div className="flex flex-col gap-y-6 mt-8 h-full">
      <SearchButton variant="outline" />
      <div className="flex flex-col gap-y-2">
        <div className="font-medium text-muted-foreground">Documents</div>
        <Separator />
        <DashboardDocList />
      </div>
    </div>
  );
};
