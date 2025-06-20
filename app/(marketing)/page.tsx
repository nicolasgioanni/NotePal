import { Footer } from "./_components/footer";
import { Heading } from "./_components/heading";
import { Heros } from "./_components/heros";

const MarketingPage = () => {
  return (
    <div className="min-h-full flex flex-col">
      <div
        className="flex flex-col items-center
            justify-start text-center flex-1 px-6 pb-10"
      >
        <Heading />
        <Heros />
      </div>
      <Footer />
    </div>
  );
};

export default MarketingPage;
