import { cn } from "@/lib/utils";

interface NavProps {
  isCollapsed: boolean;
}

export function Nav({ isCollapsed }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    ></div>
  );
}
