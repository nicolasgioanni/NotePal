import { MobileSidebarButton } from "@/components/mobile-sidebar-button";
import { DashboardBody } from "./_components/dashboard-body";
import { DashboardTitle } from "./_components/dashboard-title";

export default function DashboardPage() {
  return (
    <div className="w-full h-full px-6 py-5 overflow-y-auto">
      <div className="flex justify-center">
        <div className="h-full w-full max-w-4xl">
          <div className="flex gap-x-5">
            <MobileSidebarButton />
            <DashboardTitle />
          </div>

          <DashboardBody />
        </div>
      </div>
    </div>
  );
}
