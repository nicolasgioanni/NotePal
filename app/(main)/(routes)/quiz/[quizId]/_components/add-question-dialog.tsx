"use client";

import { Quiz } from "@/models/types";
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
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useMediaQuery } from "@/hooks/use-media-query";
import { createQuestion } from "@/db/firebase/quiz";

interface AddQuestionButtonProps {
  initialData: Quiz;
  button: React.ReactNode;
}

export const AddQuestionDialog = ({
  initialData,
  button,
}: AddQuestionButtonProps) => {
  const [questionValue, setQuestionValue] = useState("");
  const [answerValue, setAnswerValue] = useState("");
  const [falseAnswers, setFalseAnswers] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleAddQuestion = async () => {
    if (!initialData.id) return;
    setIsSubmitting(true);
    // Create a new flashcard
    await createQuestion(initialData.id, {
      question: questionValue,
      answer: answerValue,
      false_answers: falseAnswers,
    })
      .then(() => {
        // Reset the form
        setQuestionValue("");
        setAnswerValue("");
        setFalseAnswers([]);
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
            <DrawerTitle>Create question</DrawerTitle>
            <DrawerDescription>
              Create a new question to add to this quiz.
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-4 px-4">
            <div className="flex flex-col gap-y-1.5">
              <Label
                htmlFor="question"
                className="text-left"
              >
                Question
              </Label>
              <Textarea
                id="question"
                placeholder="eg. 'What is Spider-man's real name'"
                className="resize-none"
                value={questionValue}
                disabled={isSubmitting}
                onChange={(e) => {
                  setQuestionValue(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-y-1.5">
              <Label
                htmlFor="answer"
                className="text-left"
              >
                Answer
              </Label>
              <Textarea
                id="answer"
                placeholder="eg. 'Peter Parker'"
                className="resize-none"
                value={answerValue}
                disabled={isSubmitting}
                onChange={(e) => {
                  setAnswerValue(e.target.value);
                }}
              />
            </div>
          </div>
          <DrawerFooter className="w-full mt-3">
            <Button
              type="submit"
              className="w-full gap-x-1.5"
              disabled={!questionValue || !answerValue || isSubmitting}
              onClick={async () => {
                await handleAddQuestion();
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
          <DialogTitle>Create question</DialogTitle>
          <DialogDescription>
            Create a new question to add to this quiz.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex flex-col gap-y-1.5">
            <Label
              htmlFor="question"
              className="text-left"
            >
              Question
            </Label>
            <Textarea
              id="question"
              placeholder="eg. 'What is Spider-man's real name'"
              className="resize-none"
              value={questionValue}
              disabled={isSubmitting}
              onChange={(e) => {
                setQuestionValue(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-y-1.5">
            <Label
              htmlFor="answer"
              className="text-left"
            >
              Answer
            </Label>
            <Textarea
              id="answer"
              placeholder="eg. 'Peter Parker'"
              className="resize-none"
              value={answerValue}
              disabled={isSubmitting}
              onChange={(e) => {
                setAnswerValue(e.target.value);
              }}
            />
          </div>
        </div>
        <DialogFooter className="w-full mt-3">
          <Button
            type="submit"
            className="w-full gap-x-1.5"
            disabled={!questionValue || !answerValue || isSubmitting}
            onClick={async () => {
              await handleAddQuestion();
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
