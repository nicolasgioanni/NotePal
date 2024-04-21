import { Navbar } from "@/app/(main)/_components/_navbar/navbar";
import { ScrollArea } from "@/components/ui/scroll-area";

const EditorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex flex-col">
      <Navbar />
      <ScrollArea>
        <main className="h-full">{children}</main>
      </ScrollArea>
    </div>
  );
};

export default EditorLayout;
