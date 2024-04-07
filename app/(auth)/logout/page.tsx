"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { redirect } from "next/navigation";

import { useEffect } from "react";

const LogOutPage = () => {
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (!loading && user) {
      auth
        .signOut()
        .then(() => {
          console.log("Signed out");
          redirect("/");
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (!loading && !user) {
      redirect("/");
    }
  }, [user, loading]);

  return <div>Logging out...</div>;
};

export default LogOutPage;
