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
import { Loader2, Minus, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useMediaQuery } from "@/hooks/use-media-query";
import { createQuestion } from "@/db/firebase/quiz";
import { Input } from "@/components/ui/input";

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
        <Input
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
      <div className="flex flex-col gap-y-1.5">
        <Label
          htmlFor="false_answers"
          className="text-left"
        >
          False answers
        </Label>
        {falseAnswers.map((falseAnswer, index) => (
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
              disabled={isSubmitting}
              onChange={(e) => {
                const newFalseAnswers = [...falseAnswers];
                newFalseAnswers[index] = e.target.value;
                setFalseAnswers(newFalseAnswers);
              }}
            />
            <Button
              disabled={isSubmitting}
              variant="ghost"
              size="hug"
              className="absolute right-0 p-1 m-2"
              onClick={() => {
                const newFalseAnswers = [...falseAnswers];
                newFalseAnswers.splice(index, 1);
                setFalseAnswers(newFalseAnswers);
              }}
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() => {
            setFalseAnswers([...falseAnswers, ""]);
          }}
          disabled={isSubmitting || falseAnswers.length >= 4}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  if (!isDesktop)
    return (
      <Drawer
        open={isOpen}
        onOpenChange={(open) => {
          if (open) {
            setQuestionValue("");
            setAnswerValue("");
            setFalseAnswers([]);
          }
          setIsOpen(open);
        }}
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
          <div className="px-4">{content}</div>
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
      onOpenChange={(open) => {
        if (open) {
          setQuestionValue("");
          setAnswerValue("");
          setFalseAnswers([]);
        }
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>{button}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create question</DialogTitle>
          <DialogDescription>
            Create a new question to add to this quiz.
          </DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter className="w-full mt-3">
          <Button
            type="submit"
            className="w-full gap-x-1.5"
            // disabled if at least one value in false answers is empty
            disabled={
              !questionValue ||
              !answerValue ||
              isSubmitting ||
              falseAnswers.length === 0 ||
              falseAnswers.some((answer) => answer === "")
            }
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
