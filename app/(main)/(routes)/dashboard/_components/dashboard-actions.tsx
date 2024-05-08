"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DollarSign, SquarePen, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const DashboardActions = () => {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return (
    <div
      ref={ref}
      className={cn("grid grid-cols-3 gap-4", width < 856 && "grid-cols-1")}
    >
      <Card className="flex flex-col hover:scale-[1.02] transition cursor-pointer hover:outline outline-1 outline-muted">
        <CardContent className="px-6 py-10 my-auto">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-1">
              <div className="text-2xl font-bold">New Document</div>
              <p className="text-xs text-muted-foreground">
                Use AI to help you take notes
              </p>
            </div>
            <SquarePen className="w-6 h-6 text-muted-foreground shrink-0" />
          </div>
        </CardContent>
      </Card>
      <Card className="flex flex-col hover:scale-[1.02] transition cursor-pointer hover:outline outline-1 outline-muted">
        <CardContent className="px-6 py-10">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-1">
              <div className="text-2xl font-bold">New Flashcards</div>
              <p className="text-xs text-muted-foreground">
                Create flashcards from your notes
              </p>
            </div>
            <Zap className="w-6 h-6 text-muted-foreground shrink-0" />
          </div>
        </CardContent>
      </Card>
      <Card className="flex flex-col hover:scale-[1.02] transition cursor-pointer hover:outline outline-1 outline-muted">
        <CardContent className="px-6 py-10">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-1">
              <div className="text-2xl font-bold">Quiz Generation</div>
              <p className="text-xs text-muted-foreground">
                Create flashcards from your notes
              </p>
            </div>
            <Zap className="w-6 h-6 text-muted-foreground shrink-0" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
