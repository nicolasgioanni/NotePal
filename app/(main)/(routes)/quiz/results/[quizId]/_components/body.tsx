"use client";
import { useEffect, useState } from "react";
import { PracticeQuizResult, UserAnswer } from "@/models/types";
import { getQuizResultsByQuizId } from "@/db/firebase/quiz-result";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
          <div
            key={result.id}
            className="border rounded-md px-5 py-4"
          >
            Result: {getCorrectAnswersCount(result.userAnswers)} /{" "}
            {result.userAnswers.length}
            <br />
            id: {result.id}
            <br />
            <span className="text-muted-foreground">
              {timeDifferences[index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
