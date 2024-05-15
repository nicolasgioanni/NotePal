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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { createFlashcard } from "@/db/firebase/flashcards";
import { useMediaQuery } from "@/hooks/use-media-query";

interface AddFlashcardButtonProps {
  initialData: FlashcardDeck;
  button: React.ReactNode;
}

export const AddFlashcardDialog = ({
  initialData,
  button,
}: AddFlashcardButtonProps) => {
  const [frontValue, setFrontValue] = useState("");
  const [backValue, setBackValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleAddFlashcard = async () => {
    if (!initialData.id) return;
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

  if (!isDesktop)
    return (
      <Drawer
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DrawerTrigger asChild>{button}</DrawerTrigger>
        <DrawerContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DrawerHeader>
            <DrawerTitle>Create flashcard</DrawerTitle>
            <DrawerDescription>
              Create a new flashcard to add to this deck.
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-4 px-4">
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
          <DrawerFooter className="w-full mt-3">
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
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>{button}</DialogTrigger>

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
