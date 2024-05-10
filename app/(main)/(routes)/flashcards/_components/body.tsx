"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Document } from "@/models/types";
import { File, Plus } from "lucide-react";
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

const cardQuantityOptions = [
  { value: 0, label: "Auto", icon: Sparkles },
  { value: 5, label: "5 cards", icon: GalleryHorizontalEnd },
  { value: 10, label: "10 cards", icon: GalleryHorizontalEnd },
  { value: 15, label: "15 cards", icon: GalleryHorizontalEnd },
  { value: 20, label: "20 cards", icon: GalleryHorizontalEnd },
];

export const Body = () => {
  const [selectedNote, setSelectedNote] = useState<Document | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [tabValue, setTabValue] = useState("notes");
  const [cardQuantity, setCardQuantity] = useState(
    cardQuantityOptions.find((option) => option.value === 5)
  );
  const [textareaValue, setTextareaValue] = useState("");

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
          />
        </TabsContent>
      </Tabs>
      <div className="w-full flex justify-center gap-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="gap-x-2 text-primary/80 w-[200px]"
            >
              {cardQuantity?.icon && <cardQuantity.icon className="w-4 h-4" />}
              {cardQuantity?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[200px]"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DropdownMenuLabel className="text-muted-foreground">
              Number of cards
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="text-muted-foreground gap-y-1">
              {cardQuantityOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => setCardQuantity(option)}
                  className={cn(
                    "cursor-pointer mt-1",
                    cardQuantity?.value === option.value &&
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
            (!textareaValue && tabValue === "custom")
          }
          className="gap-x-2 w-[200px] hover:ring-1 hover:ring-primary hover:ring-offset-2 transition-all duration-200"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate</span>
        </Button>
      </div>
    </div>
  );
};
