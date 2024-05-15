"use client";

import { FlashcardDeck } from "@/models/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { createFlashcard } from "@/db/firebase/flashcards";
import { AddFlashcardDialog } from "./add-flashcard-dialog";

interface AddFlashcardButtonProps {
  initialData: FlashcardDeck;
}

export const AddFlashcardButton = ({
  initialData,
}: AddFlashcardButtonProps) => {
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
    <AddFlashcardDialog
      initialData={initialData}
      button={button}
    />
  );
};
