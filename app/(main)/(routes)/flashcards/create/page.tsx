import { MobileSidebarButton } from "@/components/mobile-sidebar-button";
import { Body } from "./_components/body";
import { SelectNoteCommand } from "./_components/select-note";
import { Title } from "./_components/title";

export default function FlashCardsPage() {
  return (
    <div className="flex justify-center">
      <div className="w-full h-full max-w-4xl">
        <div className="flex gap-x-4">
          <MobileSidebarButton />
          <Title />
        </div>

        <Body />
      </div>
    </div>
  );
}
