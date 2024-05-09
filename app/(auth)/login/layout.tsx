// ui imports
import { Navbar } from "./_components/navbar";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Navbar />
      <main className="pt-48">{children}</main>
    </div>
  );
};

export default AuthLayout;
