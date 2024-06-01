"use client";
import { useEffect, useState } from "react";
import { PracticeQuizResult, UserAnswer } from "@/models/types";
import { getQuizResultsByQuizId } from "@/db/firebase/quiz-result";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BodyProps {
  quizId: string;
}

const calculateTimeDifference = (date: Date) => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const remainingMinutes = diffInMinutes % 60;
  const diffInDays = Math.floor(diffInHours / 24);
  const remainingHours = diffInHours % 24;

  if (diffInMinutes < 1) {
    return "Now";
  } else if (diffInDays > 7) {
    return "7+ days ago";
  } else if (diffInDays >= 1) {
    if (remainingHours >= 12) {
      return `${diffInDays + 1} day${diffInDays + 1 > 1 ? "s" : ""} ago`;
    } else {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
  } else if (diffInHours >= 1) {
    if (remainingMinutes >= 30) {
      return `${diffInHours + 1} hour${diffInHours + 1 > 1 ? "s" : ""} ago`;
    } else {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    }
  } else {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }
};

export const Body = ({ quizId }: BodyProps) => {
  const [quizResults, setQuizResults] = useState<PracticeQuizResult[]>([]);
  const [timeDifferences, setTimeDifferences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizResults = async () => {
      const results = await getQuizResultsByQuizId(quizId);
      setQuizResults(results ? (results as PracticeQuizResult[]) : []);
      setIsLoading(false);
    };

    fetchQuizResults();
  }, [quizId]);

  useEffect(() => {
    const updateTimes = () => {
      const newTimeDifferences = quizResults.map((result) =>
        calculateTimeDifference(new Date(result.dateCreated))
      );
      setTimeDifferences(newTimeDifferences);
    };

    updateTimes();
    const intervalId = setInterval(updateTimes, 2 * 60 * 1000); // Update every 2 minutes

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [quizResults]);

  const sortedQuizResults = quizResults.sort((a, b) => {
    return (
      new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    );
  });

  const getCorrectAnswersCount = (userAnswers: UserAnswer[]) => {
    return userAnswers.filter((answer) => answer.correct).length;
  };

  if (!isLoading && quizResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] h-2/3">
        <h1 className="text-3xl font-semibold mb-2">No results found</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Start the quiz to see your results
        </p>
        <Button asChild>
          <Link href={`/quiz/practice/${quizId}`}>Start quiz</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-y-4">
        {sortedQuizResults.map((result, index) => (
          <Card
            key={result.id}
            className="hover:scale-[1.005] transition-transform cursor-pointer"
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div>Attempt: {sortedQuizResults.length - index}</div>
                <div className="flex h-8 text-xl gap-x-3 items-center border rounded-lg p-2">
                  <div className="flex gap-x-2 items-center text-green-500">
                    <CheckCircle className="w-4 h-4" />
                    {getCorrectAnswersCount(result.userAnswers)}
                  </div>
                  <Separator orientation="vertical" />
                  <div className="flex gap-x-2 items-center text-red-500">
                    {result.userAnswers.length -
                      getCorrectAnswersCount(result.userAnswers)}
                    <XCircle className="w-4 h-4" />
                  </div>
                </div>
              </CardTitle>
              <CardDescription>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {timeDifferences[index]}
                  </span>
                  {/* Percentage correct (Whole number) */}
                  <div className="text-muted-foreground">
                    {Math.round(
                      (getCorrectAnswersCount(result.userAnswers) /
                        result.userAnswers.length) *
                        100
                    )}
                    %
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
