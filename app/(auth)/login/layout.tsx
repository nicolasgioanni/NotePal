// ui imports
import { Navbar } from "./_components/navbar";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <main className="pt-60">{children}</main>
    </div>
  );
};

export default AuthLayout;
