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

interface AddFlashcardButtonProps {
  initialData?: FlashcardDeck;
}

export const AddFlashcardButton = ({
  initialData,
}: AddFlashcardButtonProps) => {
  const [frontValue, setFrontValue] = useState("");
  const [backValue, setBackValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddFlashcard = async () => {
    if (!initialData || !initialData.id) return;
    setIsSubmitting(true);
    // Create a new flashcard
    await createFlashcard(initialData.id, {
      back: backValue,
      front: frontValue,
    })
      .then(() => {
        // Reset the form
        setFrontValue("");
        setBackValue("");
        setIsOpen(false);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="hug"
          className="p-1 text-muted-foreground hover:text-primary/80"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create flashcard</DialogTitle>
          <DialogDescription>
            Create a new flashcard to add to this deck.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex flex-col gap-y-1.5">
            <Label
              htmlFor="front"
              className="text-left"
            >
              Front
            </Label>
            <Textarea
              id="front"
              placeholder="eg. 'Spider-man's real name'"
              className="resize-none"
              value={frontValue}
              disabled={isSubmitting}
              onChange={(e) => {
                setFrontValue(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-y-1.5">
            <Label
              htmlFor="back"
              className="text-left"
            >
              Back
            </Label>
            <Textarea
              id="back"
              placeholder="eg. 'Peter Parker'"
              className="resize-none"
              value={backValue}
              disabled={isSubmitting}
              onChange={(e) => {
                setBackValue(e.target.value);
              }}
            />
          </div>
        </div>
        <DialogFooter className="w-full mt-3">
          <Button
            type="submit"
            className="w-full gap-x-1.5"
            disabled={!frontValue || !backValue || isSubmitting}
            onClick={async () => {
              await handleAddFlashcard();
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Adding</span>
              </>
            ) : (
              "Add"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
