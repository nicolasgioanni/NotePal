"use client";

import { Separator } from "@/components/ui/separator";
import { DashboardDocList } from "./dashboard-doc-list";

export const DashboardDocs = () => {
  return (
    <div className="flex flex-col gap-y-2 mt-8 h-full">
      <div className="font-medium text-muted-foreground">Documents</div>
      <Separator />
      <DashboardDocList />
    </div>
  );
};
