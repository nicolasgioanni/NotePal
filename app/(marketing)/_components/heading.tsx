"use client";

// react imports
import { useEffect } from "react";

// next imports
import { useRouter } from "next/navigation";

// ui imports
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Heading = () => {
  const router = useRouter();

  const handleEnterNotePal = () => {
    router.push("/documents");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="text-4xl sm:text-5xl md:text-6xl font-medium flex flex-col">
        <span>
          Study <span className="font-bold">smarter,</span>{" "}
        </span>
        <span>not harder with NotePal</span>
      </div>
      <h3 className="text-lg sm:text-xl md:text-2xl font-medium">
        Elevate your note-taking and learning with AI by your side.
      </h3>
      <Button
        className="py-6 px-4 sm:py-7 sm:px-5"
        onClick={handleEnterNotePal}
      >
        <span className="text-lg">Enter NotePal</span>{" "}
        <ArrowRight className="ml-4 h-6 w-6" />
      </Button>
    </div>
  );
};
