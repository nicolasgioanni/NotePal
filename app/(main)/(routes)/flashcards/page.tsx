import { Body } from "./_components/body";
import { SelectNoteCommand } from "./_components/select-note";
import { Title } from "./_components/title";

export default function FlashCardsPage() {
  return (
    <div className="w-full h-full px-6 py-5 overflow-y-auto">
      <Title />
      <Body />
    </div>
  );
}
