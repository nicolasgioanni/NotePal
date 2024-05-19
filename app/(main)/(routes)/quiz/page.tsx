import { MobileSidebarButton } from "@/components/mobile-sidebar-button";
import { Body } from "./_components/body";
import { SelectNoteCommand } from "./_components/select-note";
import { Title } from "./_components/title";

export default function QuizPage() {
  return (
    <div className="w-full h-full">
      <div className="flex gap-x-4">
        <MobileSidebarButton />
        <Title />
      </div>

      <Body />
    </div>
  );
}
