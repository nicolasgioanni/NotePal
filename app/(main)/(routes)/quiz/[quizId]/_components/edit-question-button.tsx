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
import { Loader2, Minus, Pencil, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

import { useMediaQuery } from "@/hooks/use-media-query";
import { deleteQuestion, updateQuestion } from "@/db/firebase/quiz";
import { Input } from "@/components/ui/input";

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

  const content = (
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
        <Input
          id="answer"
          placeholder="eg. 'Peter Parker'"
          className="resize-none"
          value={newAnswer}
          disabled={isDeleting}
          onChange={(e) => {
            setNewAnswer(e.target.value);
          }}
        />
      </div>
      <div className="flex flex-col gap-y-1.5">
        <Label
          htmlFor="false_answers"
          className="text-left"
        >
          False answers
        </Label>
        {newFalseAnswers.map((falseAnswer, index) => (
          <div
            key={index}
            className="flex gap-x-1 relative items-center"
          >
            <Input
              key={index}
              id={`false_answer_${index}`}
              placeholder="eg. 'Miles Morales'"
              className="resize-none flex-1 pr-10"
              value={falseAnswer}
              disabled={isDeleting}
              onChange={(e) => {
                const falseAnswers = [...newFalseAnswers];
                falseAnswers[index] = e.target.value;
                setNewFalseAnswers(falseAnswers);
              }}
            />
            <Button
              disabled={isDeleting}
              variant="ghost"
              size="hug"
              className="absolute right-0 p-1 m-2"
              onClick={() => {
                const falseAnswers = [...newFalseAnswers];
                falseAnswers.splice(index, 1);
                setNewFalseAnswers(falseAnswers);
              }}
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() => {
            setNewFalseAnswers([...newFalseAnswers, ""]);
          }}
          disabled={isDeleting || newFalseAnswers.length >= 4}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  if (!isDesktop) {
    return (
      <Drawer
        open={isOpen}
        onOpenChange={(open) => {
          if (open) {
            setNewQuestion(question.question);
            setNewAnswer(question.answer);
            setNewFalseAnswers(question.false_answers);
          }
          setIsOpen(open);
        }}
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
          <div className="px-4">{content}</div>
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
      onOpenChange={(open) => {
        if (open) {
          setNewQuestion(question.question);
          setNewAnswer(question.answer);
          setNewFalseAnswers(question.false_answers);
        }
        setIsOpen(open);
      }}
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
        {content}
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
            disabled={
              !newQuestion ||
              !newAnswer ||
              isDeleting ||
              newFalseAnswers.length === 0 ||
              newFalseAnswers.some((answer) => answer === "")
            }
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
