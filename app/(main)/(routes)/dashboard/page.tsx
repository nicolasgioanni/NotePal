import { DashboardBody } from "./_components/dashboard-body";
import { DashboardTitle } from "./_components/dashboard-title";

export default function DashboardPage() {
  return (
    <div className="w-full h-full px-6 py-5 overflow-y-auto">
      <DashboardTitle />
      <DashboardBody />
    </div>
  );
}
