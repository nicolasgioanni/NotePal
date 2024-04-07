"use client";

// react imports
import { useState } from "react";

// util imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// firebase imports
import { auth, googleProvider } from "@/firebase/config";
import { sendSignInLinkToEmail, signInWithPopup } from "firebase/auth";

// next imports
import { redirect, useRouter } from "next/navigation";
import Image from "next/image";

// ui imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email(),
});

const LogInBody = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const { email } = values;

    const actionCodeSettings = {
      url: "http://localhost:3000/documents",
      handleCodeInApp: true,
    };

    const res = sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem("emailForSignIn", email);
        setEmailSent(true);
        setEmail(email);
        form.reset({ email: "" });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleContinueWithGoogle = async () => {
    const res = signInWithPopup(auth, googleProvider)
      .then((result) => {
        redirect("/documents");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 md:w-[430px]">
        <div className="space-y-4 flex flex-col text-center">
          <h1 className="text-4xl md:text-5xl font-semibold">Welcome</h1>
          <p className="text-muted-foreground text-sm md:text-lg">
            Enter your email below to continue
          </p>
        </div>
        <div className="space-y-3 flex flex-col w-full text-center">
          <div className="flex flex-col text-left">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-full flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="name@example.com"
                          />
                        </FormControl>
                        <FormMessage className="font-semibold" />
                      </FormItem>
                    );
                  }}
                />
                <Button type="submit">Continue</Button>
              </form>
            </Form>
          </div>
        </div>
        {emailSent && (
          <div className="flex flex-col space-y-3 text-center text-muted-foreground text-sm">
            <p>An email has been sent to {email}.</p>
            <p> Click the link in the email to continue.</p>
          </div>
        )}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        <div className="space-y-3 flex flex-col w-full text-center">
          <Button
            variant="outline"
            onClick={handleContinueWithGoogle}
          >
            <Image
              src="/google-icon-logo.svg"
              height="16"
              width="16"
              alt="Logo"
            />
            <span className="pl-2">Continue with Google</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogInBody;
