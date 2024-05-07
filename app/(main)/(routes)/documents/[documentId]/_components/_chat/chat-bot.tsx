"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2, SendHorizonal } from "lucide-react";
import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Markdown from "react-markdown";
import { useChat } from "ai/react";
import { Message } from "ai";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Chat } from "openai/resources/index.mjs";
import Link from "next/link";

export function ChatBot() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const params = useParams();
  const formRef = useRef<HTMLFormElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat({
    body: {
      docId: params.documentId,
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFocused(false);
    handleSubmit(e);
  };

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div
        className=" flex flex-col gap-y-2 overflow-y-auto mb-[77px] px-3"
        ref={scrollAreaRef}
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
          />
        ))}
        {isLoading && lastMessageIsUser && (
          <ChatMessage
            message={{
              id: "loading",
              role: "assistant",
              content: "Thinking...",
            }}
          />
        )}
        {error && (
          <ChatMessage
            message={{
              id: "error",
              role: "assistant",
              content: "Something went wrong! Please try again",
            }}
          />
        )}
      </div>
      <div className="px-3 py-4 flex sticky bg-background bottom-0">
        <form
          className={cn(
            "flex w-full items-center pl-3 pr-2 py-2 border rounded-md gap-x-1 bg-background shadow-md",
            isFocused && "outline outline-1 outline-blue-500"
          )}
          onSubmit={handleFormSubmit}
          ref={formRef}
        >
          <TextareaAutosize
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
            placeholder="Ask NotePal anything..."
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
            className="resize-none bg-transparent w-full max-h-64 outline-none placeholder-shown:truncate"
          />
          <div className="flex h-full items-end">
            <Button
              className="p-2"
              size="hug"
              variant="ghost"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <SendHorizonal className="h-5 w-5" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChatMessage({ message: { role, content } }: { message: Message }) {
  return (
    <div className="border rounded-md">
      <div className="px-3 py-2">
        <div
          className={cn(
            "font-semibold mb-1",
            role === "user" ? "text-muted-foreground" : "text-blue-500"
          )}
        >
          {role === "user" ? "You" : "NotePal"}
        </div>
        <div className="prose-sm w-full dark:prose-invert prose-headings:text-lg prose-headings:font-semibold">
          <ReactMarkdown
            components={{
              a: ({ node, ref, ...props }) => (
                <Link
                  {...props}
                  href={props.href ?? ""}
                  className="text-muted-foreground hover:text-primary transition-colors underline"
                />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  {...props}
                  className="list-disc"
                />
              ),
              li: ({ node, ...props }) => (
                <li
                  {...props}
                  className="list-disc"
                />
              ),
              code: ({ node, ...props }) => (
                <code
                  {...props}
                  className="bg-accent p-1 rounded-md"
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
