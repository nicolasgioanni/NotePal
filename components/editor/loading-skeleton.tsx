import { Skeleton } from "../ui/skeleton";

export const LoadingSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-3">
      <Skeleton className="w-3/5 h-8 rounded-full" />
      <Skeleton className="w-4/5 h-8 rounded-full" />
      <Skeleton className="w-3/4 h-8 rounded-full" />
      <Skeleton className="w-2/3 h-8 rounded-full" />
    </div>
  );
};
