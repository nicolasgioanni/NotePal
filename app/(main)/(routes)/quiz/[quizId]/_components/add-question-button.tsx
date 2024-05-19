"use client";

import { Quiz } from "@/models/types";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { AddQuestionDialog } from "./add-question-dialog";

interface AddQuestionButtonProps {
  initialData: Quiz;
}

export const AddQuestionButton = ({ initialData }: AddQuestionButtonProps) => {
  const button = (
    <Button
      variant="ghost"
      size="hug"
      className="p-1 text-muted-foreground hover:text-primary/80"
    >
      <Plus className="w-5 h-5" />
    </Button>
  );

  return (
    <AddQuestionDialog
      initialData={initialData}
      button={button}
    />
  );
};
