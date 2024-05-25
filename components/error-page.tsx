import Link from "next/link";
import { Button } from "./ui/button";

export const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-semibold mb-2">Oh no!</h1>
      <p className="text-lg text-muted-foreground mb-4">
        You don&apos;t have access to this page
      </p>
      <Button asChild>
        <Link href="/dashboard">Back to my content</Link>
      </Button>
    </div>
  );
};
