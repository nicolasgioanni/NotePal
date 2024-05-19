"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Document } from "@/models/types";
import { File, Plus, Loader2, Hash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SelectNoteCommand } from "./select-note";
import { Button } from "@/components/ui/button";
import { GalleryHorizontalEnd, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAllDocuments } from "@/hooks/use-documents-by-user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const questionQuantityOptions = [
  { value: 0, label: "Auto", icon: Sparkles },
  { value: 5, label: "5 questions", icon: Hash },
  { value: 10, label: "10 questions", icon: Hash },
  { value: 15, label: "15 questions", icon: Hash },
  { value: 20, label: "20 questions", icon: Hash },
];

export const Body = () => {
  const [selectedNote, setSelectedNote] = useState<Document | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [tabValue, setTabValue] = useState("notes");
  const [questionQuantity, setQuestionQuantity] = useState(
    questionQuantityOptions.find((option) => option.value === 5)
  );
  const [textareaValue, setTextareaValue] = useState("");
  const { documents, isLoading, error } = useAllDocuments();
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsGenerating(true);
    const payload =
      tabValue === "notes"
        ? {
            type: "note",
            noteId: selectedNote?.id,
            questionQuantity: questionQuantity?.value,
          }
        : {
            type: "custom",
            topic: textareaValue,
            questionQuantity: questionQuantity?.value,
          };

    const promise = fetch("/api/generate-quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        setSelectedNote(null);
        setTextareaValue("");
        if (!response.ok) {
          throw new Error("Failed to generate quiz");
        }
        const data = await response.json();
        const quizId = data.quizId;
        router.push(`/quiz/${quizId}`);
      })
      .catch((error) => {
        console.error("Failed to generate quiz");
      })
      .finally(() => {
        setIsGenerating(false);
      });

    toast.promise(promise, {
      loading: "Generating quiz...",
      success: "Quiz created!",
      error: "Failed to create quiz.",
    });
  };

  useEffect(() => {
    if (!isLoading && selectedNote) {
      // Use find or some to check based on a property, commonly `id`
      const noteExists = documents.some((doc) => doc.id === selectedNote.id);

      if (!noteExists) {
        setSelectedNote(null);
      }
    }
  }, [documents, selectedNote, isLoading]);

  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <SelectNoteCommand
        onSelect={setSelectedNote}
        isOpen={searchOpen}
        setOpen={setSearchOpen}
      />
      <Tabs
        defaultValue={tabValue}
        onValueChange={setTabValue}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        <TabsContent
          className="mt-4"
          value="notes"
        >
          <Button
            variant="ghost"
            className="w-full border-2 border-dotted h-24 text-muted-foreground"
            disabled={isGenerating}
            onClick={() => setSearchOpen(true)}
          >
            {selectedNote ? (
              <div className="flex items-center justify-center gap-x-2">
                <File className="w-5 h-5" />
                <span className="text-lg">{selectedNote.title}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-x-2">
                <Plus className="w-5 h-5" />
                <span className="text-lg">Select a note</span>
              </div>
            )}
          </Button>
        </TabsContent>
        <TabsContent
          className="mt-4"
          value="custom"
        >
          <Textarea
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            className="w-full h-24 resize-none focus-visible:ring-primary/50"
            placeholder="Type some topic. e.g. 'JavaScript'"
            disabled={isGenerating}
          />
        </TabsContent>
      </Tabs>
      <div className="w-full flex justify-center gap-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="gap-x-2 text-primary/80 w-[200px]"
              disabled={isGenerating}
            >
              {questionQuantity?.icon && (
                <questionQuantity.icon className="w-4 h-4" />
              )}
              {questionQuantity?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[200px]"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DropdownMenuLabel className="text-muted-foreground">
              Number of questions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="text-muted-foreground gap-y-1">
              {questionQuantityOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => setQuestionQuantity(option)}
                  className={cn(
                    "cursor-pointer mt-1",
                    questionQuantity?.value === option.value &&
                      "bg-accent text-primary"
                  )}
                >
                  <option.icon className="w-4 h-4 mr-2" />
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          disabled={
            (!selectedNote && tabValue === "notes") ||
            (!textareaValue && tabValue === "custom") ||
            isGenerating
          }
          onClick={handleSubmit}
          className="gap-x-2 w-[200px] hover:ring-1 hover:ring-primary hover:ring-offset-2 transition-all duration-200"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}

          <span>{isGenerating ? "Generating..." : "Generate"}</span>
        </Button>
      </div>
    </div>
  );
};
