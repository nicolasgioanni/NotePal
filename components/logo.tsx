import Image from "next/image";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const Logo = () => {
  return (
    <div className="flex items-center gap-x-2">
      <a href="/">
        <p className={cn("font-extrabold text-2xl", font.className)}>NotePal</p>
      </a>
    </div>
  );
};
