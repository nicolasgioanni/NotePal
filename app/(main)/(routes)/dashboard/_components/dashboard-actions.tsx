"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDocument } from "@/db/firebase/document";
import { cn } from "@/lib/utils";
import { DollarSign, SquarePen, WandSparkles, Zap } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const DashboardActions = () => {
  const router = useRouter();
  return (
    <div className="flex justify-around flex-wrap gap-4">
      <Card
        onClick={async () => {
          await createDocument().then((docId) => {
            router.push(`/documents/${docId}`);
          });
        }}
        className="flex-grow hover:scale-[1.02] transition cursor-pointer hover:outline outline-1 outline-muted"
      >
        <CardContent className="px-6 py-10 my-auto">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-1">
              <div className="text-2xl font-semibold">New Document</div>
              <p className="text-xs text-muted-foreground">
                Use AI to help you take notes
              </p>
            </div>
            <SquarePen className="w-5 h-5 text-muted-foreground shrink-0 ml-2" />
          </div>
        </CardContent>
      </Card>
      <Card
        onClick={() => {
          router.push(`/flashcards`);
        }}
        className="flex-grow hover:scale-[1.02] transition cursor-pointer hover:outline outline-1 outline-muted"
      >
        <CardContent className="px-6 py-10 my-auto">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-1">
              <div className="text-2xl font-semibold">New Flashcards</div>
              <p className="text-xs text-muted-foreground">
                Create flashcards from your notes
              </p>
            </div>
            <Zap className="w-5 h-5 text-muted-foreground shrink-0 ml-2" />
          </div>
        </CardContent>
      </Card>
      <Card
        onClick={() => {
          router.push(`/quiz`);
        }}
        className="flex-grow hover:scale-[1.02] transition cursor-pointer hover:outline outline-1 outline-muted"
      >
        <CardContent className="px-6 py-10 my-auto">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-1">
              <div className="text-2xl font-semibold">Quiz Generation</div>
              <p className="text-xs text-muted-foreground">
                Create quizzes from your notes
              </p>
            </div>
            <WandSparkles className="w-5 h-5 text-muted-foreground shrink-0 ml-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
