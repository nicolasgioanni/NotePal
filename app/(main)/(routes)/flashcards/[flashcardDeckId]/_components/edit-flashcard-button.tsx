"use client";

import { Flashcard, FlashcardDeck } from "@/models/types";
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
import { Loader2, Pencil, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  createFlashcard,
  deleteFlashcard,
  updateFlashcard,
} from "@/db/firebase/flashcards";

interface EditFlashcardButtonProps {
  deckId: string;
  flashcard: Flashcard;
}

export const EditFlashcardButton = ({
  deckId,
  flashcard,
}: EditFlashcardButtonProps) => {
  const [newFront, setNewFront] = useState(flashcard.front);
  const [newBack, setNewBack] = useState(flashcard.back);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditFlashcard = () => {
    updateFlashcard(deckId, flashcard.id, {
      front: newFront,
      back: newBack,
    }).catch((error) => {
      console.error(error);
    });
    setIsOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteFlashcard(deckId, flashcard.id)
      .then(() => {
        setIsOpen(false);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsDeleting(false);
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
          className="p-1.5 text-muted-foreground hover:text-primary/80"
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[425px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit flashcard</DialogTitle>
          <DialogDescription>
            Edit the front and back of this flashcard.
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
              className="resize-none bg-transparent"
              value={newFront}
              disabled={isDeleting}
              onChange={(e) => {
                setNewFront(e.target.value);
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
              className="resize-none bg-transparent"
              value={newBack}
              disabled={isDeleting}
              onChange={(e) => {
                setNewBack(e.target.value);
              }}
            />
          </div>
        </div>
        <DialogFooter className="w-full mt-3">
          <Button
            type="submit"
            className="w-full gap-x-1.5 bg-red-600 hover:bg-red-600/90 text-white"
            onClick={async () => {
              await handleDelete();
            }}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting</span>
              </>
            ) : (
              "Delete"
            )}
          </Button>
          <Button
            type="submit"
            className="w-full gap-x-1.5"
            disabled={!newFront || !newBack || isDeleting}
            onClick={() => {
              handleEditFlashcard();
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
