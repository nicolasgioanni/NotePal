"use client";

import { Question } from "@/models/types";
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
import { Loader2, Pencil, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

import { useMediaQuery } from "@/hooks/use-media-query";
import { deleteQuestion, updateQuestion } from "@/db/firebase/quiz";

interface EditQuestionButtonProps {
  quizId: string;
  question: Question;
}

export const EditQuestionButton = ({
  quizId,
  question,
}: EditQuestionButtonProps) => {
  const [newQuestion, setNewQuestion] = useState(question.question);
  const [newAnswer, setNewAnswer] = useState(question.answer);
  const [newFalseAnswers, setNewFalseAnswers] = useState(
    question.false_answers
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleEditQuestion = () => {
    updateQuestion(quizId, question.id, {
      question: newQuestion,
      answer: newAnswer,
      false_answers: newFalseAnswers,
    }).catch((error) => {
      console.error(error);
    });
    setIsOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteQuestion(quizId, question.id)
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

  if (!isDesktop) {
    return (
      <Drawer
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="hug"
            className="p-1.5 text-muted-foreground hover:text-primary/80"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </DrawerTrigger>

        <DrawerContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DrawerHeader>
            <DrawerTitle>Edit question</DrawerTitle>
            <DrawerDescription>
              Edit the question and answers.
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
                className="resize-none bg-transparent"
                value={newQuestion}
                disabled={isDeleting}
                onChange={(e) => {
                  setNewQuestion(e.target.value);
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
                className="resize-none bg-transparent"
                value={newAnswer}
                disabled={isDeleting}
                onChange={(e) => {
                  setNewAnswer(e.target.value);
                }}
              />
            </div>
          </div>
          <DrawerFooter className="w-full mt-3">
            <Button
              type="submit"
              disabled={isDeleting}
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
              disabled={!newQuestion || !newAnswer || isDeleting}
              onClick={() => {
                handleEditQuestion();
              }}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

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
          <DialogTitle>Edit question</DialogTitle>
          <DialogDescription>Edit the question and answers.</DialogDescription>
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
              placeholder="eg. 'Spider-man's real name'"
              className="resize-none bg-transparent"
              value={newQuestion}
              disabled={isDeleting}
              onChange={(e) => {
                setNewQuestion(e.target.value);
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
              className="resize-none bg-transparent"
              value={newAnswer}
              disabled={isDeleting}
              onChange={(e) => {
                setNewAnswer(e.target.value);
              }}
            />
          </div>
        </div>
        <DialogFooter className="w-full mt-3">
          <Button
            type="submit"
            disabled={isDeleting}
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
            disabled={!newQuestion || !newAnswer || isDeleting}
            onClick={() => {
              handleEditQuestion();
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
