import { MobileSidebarButton } from "@/components/mobile-sidebar-button";
import { Title } from "./_components/title";
import { Body } from "./_components/body";

export default function PracticePage() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex gap-x-4">
        <MobileSidebarButton />
        <Title />
      </div>
      <Body />
    </div>
  );
}
