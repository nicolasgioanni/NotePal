import { currentUser } from "@/lib/auth";

export const DashboardTitle = async () => {
  const user = await currentUser();

  return (
    <div className="flex flex-col gap-y-2">
      <div className="text-3xl font-semibold">Dashboard</div>
      <div className="text-muted-foreground font-medium">
        Welcome back {user?.name}!
      </div>
    </div>
  );
};
