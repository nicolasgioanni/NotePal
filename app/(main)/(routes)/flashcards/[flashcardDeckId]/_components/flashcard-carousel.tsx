"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { FlashcardDeck } from "@/models/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface FlashcardCarouselProps {
  initialData?: FlashcardDeck;
}

interface DisplayState {
  [key: string]: boolean;
}

export const FlashcardCarousel = ({ initialData }: FlashcardCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [displayState, setDisplayState] = useState<DisplayState>({});

  useEffect(() => {
    if (!api || !initialData) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      const newIndex = api.selectedScrollSnap();
      setCurrent(newIndex + 1);
      const newlyVisibleFlashcardId = initialData.flashcards[newIndex].id; // Assuming flashcards array is accessible and correctly ordered
      setDisplayState((prevState) => ({
        ...prevState,
        [newlyVisibleFlashcardId]: true,
      }));
    });
  }, [api, initialData]);

  useEffect(() => {
    // Initialize display state for each flashcard to show the front
    if (initialData) {
      const initialDisplayState: DisplayState = {};
      initialData.flashcards.forEach((flashcard) => {
        initialDisplayState[flashcard.id] = true; // true for front, false for back
      });
      setDisplayState(initialDisplayState);
    }
  }, [initialData]);

  const handleClick = (id: string) => {
    setDisplayState((prevState) => {
      return {
        ...prevState,
        [id]: !prevState[id],
      };
    });
  };

  if (!initialData)
    return (
      <div className="flex justify-center min-h-80">
        <FlashcardCarousel.Skeleton />
      </div>
    );

  const { flashcards } = initialData;

  return (
    <div className="flex flex-col justify-center items-center">
      <Carousel
        className="w-5/6"
        setApi={setApi}
      >
        <CarouselContent>
          {flashcards.map((flashcard) => (
            <CarouselItem key={flashcard.id}>
              <div className="p-1 h-full">
                <Card
                  className="h-full cursor-pointer shadow-md"
                  onClick={() => {
                    handleClick(flashcard.id);
                  }}
                >
                  <CardContent className="flex h-full aspect-video items-center justify-center p-6 overflow-x-hidden">
                    {displayState[flashcard.id] ? (
                      <span className="text-xl sm:text-2xl md:text-3xl font-medium text-center">
                        {flashcard.front}
                      </span>
                    ) : (
                      <span className="text-xl sm:text-2xl md:text-3xl font-medium text-center text-primary/80">
                        {flashcard.back}
                      </span>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        {current} / {count}
      </div>
    </div>
  );
};

FlashcardCarousel.Skeleton = function FlashcardCarouselSkeleton() {
  return <Skeleton className="w-5/6 h-auto" />;
};
