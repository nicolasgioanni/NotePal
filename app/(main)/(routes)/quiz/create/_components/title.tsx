import { currentUser } from "@/lib/auth";

export const Title = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="text-3xl font-semibold">Create Quiz</div>
      <div className="text-muted-foreground font-medium">
        Generate a practice quiz from your notes, or pick your own topic
      </div>
    </div>
  );
};
