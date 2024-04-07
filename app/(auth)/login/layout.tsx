"use client";

// ui imports
import { Navbar } from "./_components/navbar";
import { auth } from "@/firebase/config";
import { redirect } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return null;
  }

  if (!loading && user) {
    redirect("/documents");
  }

  return (
    <div>
      <Navbar />
      <main className="pt-60">{children}</main>
    </div>
  );
};

export default AuthLayout;
