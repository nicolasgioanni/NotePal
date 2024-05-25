// next imports
import Image from "next/image";

export const Heros = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div
          className="relative 
            w-[300px] h-[300px] 
            sm:w-[350px] sm:h-[350px]
            md:w-[400px] md:h-[400px]"
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
      </div>
    </div>
  );
};
