import { MailCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const VerifyEmailPage = () => {
  return (
    <main className="pt-48 h-full px-8">
      <div className="flex justify-center">
        <div className="flex flex-col justify-center items-center text-center gap-y-3">
          <MailCheck className="h-20 w-20 text-blue-500" />
          <span className="text-4xl font-semibold">Check your email</span>
          <div className="text-muted-foreground flex flex-col gap-y-2 mt-2">
            <p>We&apos;ve emailed you a link to continue</p>
            <p></p>
          </div>
          <Button
            asChild
            className="mt-1"
            variant="outline"
          >
            <Link href="/login">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go back
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default VerifyEmailPage;
