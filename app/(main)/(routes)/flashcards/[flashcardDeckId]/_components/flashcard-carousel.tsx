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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

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
      //set all cards to front
      setDisplayState((prevState) => {
        const newState = { ...prevState };
        Object.keys(newState).forEach((key) => {
          newState[key] = false;
        });
        return newState;
      });
    });
  }, [api, initialData]);

  const flipCard = (cardId: string) => {
    setDisplayState((prevState) => ({
      ...prevState,
      [cardId]: !prevState[cardId],
    }));
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
              <ReactCardFlip
                flipDirection="horizontal"
                flipSpeedFrontToBack={0.35}
                flipSpeedBackToFront={0.35}
                isFlipped={displayState[flashcard.id]}
              >
                <div className="p-1">
                  <Card
                    onClick={() => flipCard(flashcard.id)}
                    className="h-full cursor-pointer"
                  >
                    <CardContent className="flex flex-col h-full aspect-video items-center justify-center p-6 overflow-x-hidden">
                      <div className="flex flex-grow items-center text-lg md:text-2xl lg:text-3xl font-medium text-center">
                        {flashcard.front}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="p-1">
                  <Card
                    onClick={() => flipCard(flashcard.id)}
                    className="h-full cursor-pointer"
                  >
                    <CardContent className="flex flex-col h-full aspect-video items-center justify-center p-6 overflow-x-hidden">
                      <span className="flex flex-grow items-center text-lg md:text-2xl lg:text-3xl font-medium text-center text-primary/80">
                        {flashcard.back}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </ReactCardFlip>
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
