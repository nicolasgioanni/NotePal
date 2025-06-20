import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./prosemirror.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NotePal",
  description:
    " Elevate your study and productivity with AI-driven note-taking. Create notes, generate custom quizzes, and get real-time assistance, all in one intuitive platform. Transform your learning experience with NotePal today.",
  icons: [
    {
      media: "(prefers-color-scheme: light)",
      url: "/logo.svg",
      href: "/logo.svg",
    },
    {
      media: "(prefers-color-scheme: dark)",
      url: "/logo-dark.svg",
      href: "/logo-dark.svg",
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <TooltipProvider delayDuration={200}>
        <html
          className="h-full"
          lang="en"
          suppressHydrationWarning
        >
          <body className={inter.className}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="notepal-theme"
            >
              <Toaster
                position="bottom-center"
                richColors
              />
              {children}
            </ThemeProvider>
          </body>
        </html>
      </TooltipProvider>
    </SessionProvider>
  );
}
