"use client";

// react imports
import { useEffect, useState } from "react";

//firebase imports
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

// next imports
import { redirect } from "next/navigation";
import { SearchCommand } from "@/components/search-command";
import { MainView } from "../_components/main-view";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [user, loading, error] = useAuthState(auth);
  const [emailLinkCheckDone, setEmailLinkCheckDone] = useState(false);

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      if (!user && !loading) {
        let email = window.localStorage.getItem("emailForSignIn");
        if (!email) {
          email = window.prompt("Please provide your email for confirmation");
        }
        signInWithEmailLink(
          auth,
          localStorage.getItem("emailForSignIn") as string,
          window.location.href
        )
          .then((result) => {
            window.localStorage.removeItem("emailForSignIn");
            setEmailLinkCheckDone(true);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } else {
      setEmailLinkCheckDone(true);
    }
  }, [user, loading]);

  if (!loading && !user && emailLinkCheckDone) {
    redirect("/login");
  }

  return (
    <div className="h-full">
      <main className="h-full">
        <SearchCommand />
        <MainView navCollapsedSize={4}>{children}</MainView>
      </main>
    </div>
  );
};

export default MainLayout;
