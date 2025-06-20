import { DashboardActions } from "./dashboard-actions";
import { DashboardDocs } from "./dashboard-docs";

export const DashboardBody = () => {
  return (
    <div className="flex flex-col mt-6">
      <DashboardActions />
      <DashboardDocs />
    </div>
  );
};
