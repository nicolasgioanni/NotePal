import { DashboardActions } from "./dashboard-actions";
import { DashboardDocs } from "./dashboard-docs";

export const DashboardBody = () => {
  return (
    <div className="flex flex-col h-full">
      <DashboardActions />
      <DashboardDocs />
    </div>
  );
};
