import { DashboardBody } from "./_components/dashboard-body";
import { DashboardTitle } from "./_components/dashboard-title";

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full h-full gap-y-5">
      <DashboardTitle />
      <DashboardBody />
    </div>
  );
}
