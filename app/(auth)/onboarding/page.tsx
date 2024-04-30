"use client";

import { auth, db } from "@/db/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { redirect, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

// util imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, Loader2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { updateUser } from "@/db/firebase/user";
import { useSession } from "next-auth/react";
const formSchema = z.object({
  name: z.string().min(1),
});

const OnboardingPage = () => {
  const [sendingForm, setSendingForm] = useState(false);
  const router = useRouter();
  const session = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const { name } = values;
    setSendingForm(true);
    await updateUser({ name });
    await session.update();
    router.push("/documents");
  };

  return (
    <main>
      <div className="pt-60 flex">
        <div className="flex flex-col items-center mx-auto gap-y-4">
          <div className="flex flex-col items-center gap-y-2">
            <h1 className="text-2xl md:text-3xl font-semibold">
              Welcome to NotePal
            </h1>
            <p className="text-muted-foreground text-sm md:text-lg">
              Tell us a bit about yourself
            </p>
          </div>
          <div className="space-y-3 flex flex-col w-full text-center">
            <div className="flex flex-col text-left">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-6 flex flex-col"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">
                          What&apos;s your name?
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="focus:ring-transparent"
                            placeholder="eg. John Doe, John"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    disabled={!form.formState.isValid || sendingForm}
                    type="submit"
                  >
                    {sendingForm ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>Submit</>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OnboardingPage;
