import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";

export function ChatBot() {
  return (
    <div className="h-full flex flex-col justify-between">
      <div>AT TOP</div>
      <div className="flex items-center relative">
        <Textarea
          placeholder="Ask NotePal anything..."
          className="resize-none"
        />
        <Button
          className="absolute right-1 bottom-1 p-1"
          size="hug"
        >
          <SendHorizonal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
