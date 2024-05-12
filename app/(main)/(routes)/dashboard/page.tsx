import { DashboardBody } from "./_components/dashboard-body";
import { DashboardTitle } from "./_components/dashboard-title";

export default function DashboardPage() {
  return (
    <div className="w-full h-full px-6 py-5 overflow-y-auto">
      <div className="flex justify-center">
        <div className="h-full w-full max-w-4xl">
          <DashboardTitle />
          <DashboardBody />
        </div>
      </div>
    </div>
  );
}
