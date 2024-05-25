import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

export const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div
        className="relative
            w-[200px] h-[200px]
            sm:w-[250px] sm:h-[250px]
            md:w-[300px] md:h-[300px]
            -my-10"
      >
        <Image
          src="/logo-light.svg"
          fill
          alt="Logo"
          className="dark:hidden"
        />
        <Image
          src="/logo-dark.svg"
          fill
          alt="Logo"
          className="hidden dark:block"
        />
      </div>
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
