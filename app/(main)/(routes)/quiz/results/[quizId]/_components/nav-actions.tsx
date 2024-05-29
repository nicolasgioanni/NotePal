"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type NavActionsProps = {
  quizId: string;
};

export const NavActions = ({ quizId }: NavActionsProps) => {
  const router = useRouter();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => router.push(`/quiz/${quizId}`)}
        >
          <X className="w-6 h-6" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Exit</p>
      </TooltipContent>
    </Tooltip>
  );
};
