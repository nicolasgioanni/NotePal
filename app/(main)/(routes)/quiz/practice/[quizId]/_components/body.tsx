"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  createPracticeQuiz,
  getPracticeQuizByQuizId,
  updatePracticeQuiz,
} from "@/db/firebase/practice-quiz";
import { PracticeQuiz, UserAnswer } from "@/models/types";
import { CheckCircle, ChevronRight, Loader2, XCircle } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "sonner";

interface BodyProps {
  quizId: string;
  onReset: (callback: () => void) => void;
  setCurrentQuestionIndex: (index: number) => void;
}

export const Body = ({
  quizId,
  onReset,
  setCurrentQuestionIndex,
}: BodyProps) => {
  const [practiceQuiz, setPracticeQuiz] = useState<PracticeQuiz | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerOptions, setAnswerOptions] = useState<string[]>([]);
  const [numCorrect, setNumCorrect] = useState(0);
  const [numIncorrect, setNumIncorrect] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const hasShuffledRef = useRef(false);
  const creatingQuizRef = useRef(false); // Ref to track quiz creation

  const shuffleArray = (array: string[]) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const fetchPracticeQuiz = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedQuiz = await getPracticeQuizByQuizId(quizId);
      if (fetchedQuiz) {
        const parsedQuiz = JSON.parse(fetchedQuiz) as PracticeQuiz;
        setPracticeQuiz(parsedQuiz);
        setQuestionIndex(parsedQuiz.currentQuestionIndex);
        setCurrentQuestionIndex(parsedQuiz.currentQuestionIndex);
        let numCorrect = 0;
        let numIncorrect = 0;
        parsedQuiz.userAnswers.forEach((answer) => {
          if (answer.correct) {
            numCorrect++;
          } else {
            numIncorrect++;
          }
        });
        console.log(numCorrect, numIncorrect);

        setNumCorrect(numCorrect);
        setNumIncorrect(numIncorrect);
      } else if (!creatingQuizRef.current) {
        creatingQuizRef.current = true;
        await createPracticeQuiz(quizId);
        const newPracticeQuiz = await getPracticeQuizByQuizId(quizId);
        if (newPracticeQuiz) {
          const parsedNewPracticeQuiz = JSON.parse(
            newPracticeQuiz
          ) as PracticeQuiz;
          setPracticeQuiz(parsedNewPracticeQuiz);
          setQuestionIndex(0);
          setCurrentQuestionIndex(0);
          setNumCorrect(0);
          setNumIncorrect(0);
        } else {
          console.error("Failed to create and fetch new practice quiz.");
        }
        creatingQuizRef.current = false;
      }
    } catch (error) {
      console.error("Failed to fetch practice quiz: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [quizId, setCurrentQuestionIndex]);

  useEffect(() => {
    fetchPracticeQuiz();
  }, [fetchPracticeQuiz]);

  useEffect(() => {
    if (practiceQuiz && !hasShuffledRef.current) {
      const allAnswerOptions = [
        ...practiceQuiz.questions[questionIndex].false_answers,
        practiceQuiz.questions[questionIndex].answer,
      ];
      const shuffledAnswers = shuffleArray(allAnswerOptions);
      setAnswerOptions(shuffledAnswers);
      hasShuffledRef.current = true;
    }
  }, [questionIndex, practiceQuiz]);

  useEffect(() => {
    if (practiceQuiz) {
      setQuestionIndex(practiceQuiz.currentQuestionIndex);
      setSelectedAnswer(null);
      hasShuffledRef.current = false;
    }
  }, [practiceQuiz]);

  const handleNext = async () => {
    if (practiceQuiz === null || selectedAnswer === null) return;

    hasShuffledRef.current = false;

    const userAnswer: UserAnswer = {
      questionId: practiceQuiz.questions[questionIndex].id,
      answer: selectedAnswer,
      correct: selectedAnswer === practiceQuiz.questions[questionIndex].answer,
    };

    setQuestionIndex((prevIndex) => prevIndex + 1);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(questionIndex + 1);

    updatePracticeQuiz(practiceQuiz.quizId, {
      currentQuestionIndex: questionIndex + 1,
      userAnswers: [userAnswer],
    });

    if (selectedAnswer !== practiceQuiz.questions[questionIndex].answer) {
      setNumIncorrect((prevNum) => prevNum + 1);
      toast.error("Incorrect :(", { duration: 2000 });
    } else {
      setNumCorrect((prevNum) => prevNum + 1);
      toast.success("Correct!", { duration: 2000 });
    }
  };

  const handleFinish = async () => {
    if (practiceQuiz === null || selectedAnswer === null) return;

    hasShuffledRef.current = false;

    const userAnswer: UserAnswer = {
      questionId: practiceQuiz.questions[questionIndex].id,
      answer: selectedAnswer,
      correct: selectedAnswer === practiceQuiz.questions[questionIndex].answer,
    };

    updatePracticeQuiz(practiceQuiz.quizId, {
      userAnswers: [userAnswer],
    });

    if (selectedAnswer !== practiceQuiz.questions[questionIndex].answer) {
      setNumIncorrect((prevNum) => prevNum + 1);
    } else {
      setNumCorrect((prevNum) => prevNum + 1);
    }

    toast.success("Quiz completed!", { duration: 2000 });
  };

  const resetState = () => {
    hasShuffledRef.current = false;
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswerOptions([]);
  };

  useEffect(() => {
    onReset(resetState);
  }, [onReset]);

  if (isLoading || !practiceQuiz) {
    return (
      <div className="h-2/3 flex justify-center items-center min-h-96">
        <Loader2 className="animate-spin w-10 h-10 text-muted-foreground shrink-0" />
      </div>
    );
  }

  return (
    <div className="flex-grow">
      <div className="flex flex-col items-center mt-28">
        <div className="flex flex-col gap-y-8 w-full items-center max-w-2xl">
          <div className="flex flex-col items-center gap-y-4 w-full">
            <div className="flex w-full justify-between items-center">
              <p className="text-muted-foreground">
                {questionIndex + 1} of {practiceQuiz.questions.length}
              </p>
              <div className="flex h-10 gap-x-3 items-center border rounded-lg p-2">
                <div className="flex gap-x-2 items-center text-green-500">
                  <CheckCircle className="w-4 h-4" />
                  {numCorrect}
                </div>
                <Separator orientation="vertical" />
                <div className="flex gap-x-2 items-center text-red-500">
                  {numIncorrect}
                  <XCircle className="w-4 h-4" />
                </div>
              </div>
            </div>
            <h3 className="font-bold text-lg sm:text-xl">
              {practiceQuiz.questions[questionIndex].question}
            </h3>
          </div>
          <div className="flex flex-col gap-y-4 w-full">
            {answerOptions.map((answer, index) => (
              <Button
                key={index}
                onClick={() => setSelectedAnswer(answer)}
                variant={selectedAnswer === answer ? "default" : "outline"}
                className={"h-11"}
              >
                <span className="">{answer}</span>
              </Button>
            ))}
          </div>
          <div className="flex justify-center w-full">
            <Button
              disabled={selectedAnswer === null}
              onClick={
                questionIndex === practiceQuiz.questions.length - 1
                  ? handleFinish
                  : handleNext
              }
            >
              {questionIndex === practiceQuiz.questions.length - 1
                ? "Finish"
                : "Next"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
