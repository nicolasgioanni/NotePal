import { Navbar } from "./_components/navbar";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Navbar />
      <main className="h-full pt-40 max-w-5xl mx-auto">{children}</main>
    </div>
  );
};

export default MarketingLayout;
