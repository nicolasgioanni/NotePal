"use client";

import { Document } from "@/models/document";
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface PublishProps {
  initialData: Document;
}

export const Publish = ({ initialData }: PublishProps) => {
  const origin = useOrigin();

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${origin}/preview/${initialData.id}`;

  const onPublish = () => {
    if (!initialData.id) return;
    setIsSubmitting(true);
    const docRef = doc(db, "documents", initialData.id);

    const promise = updateDoc(docRef, { isPublished: true })
      .catch((error) => {
        console.error("Error publishing document: ", error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });

    toast.promise(promise, {
      loading: "Publishing document...",
      success: "Note published!",
      error: "Failed to publish document.",
    });
  };

  const onUnPublish = () => {
    if (!initialData.id) return;
    setIsSubmitting(true);
    const docRef = doc(db, "documents", initialData.id);

    const promise = updateDoc(docRef, { isPublished: false })
      .catch((error) => {
        console.error("Error unpublishing document: ", error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });

    toast.promise(promise, {
      loading: "Unpublishing document...",
      success: "Note unpublished!",
      error: "Failed to unpublish document.",
    });
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
        >
          Publish
          {initialData.isPublished && (
            <Globe className="text-sky-500 w-4 h-4 ml-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72"
        align="end"
        alignOffset={8}
        forceMount
      >
        {initialData.isPublished ? (
          <div>Published</div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-y-2">
            <Globe className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Publish this note</p>
            <span className="text-xs text-muted-foreground mb-2">
              Share your work with others
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-full text-xs"
              size="sm"
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
