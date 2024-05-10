import { SearchCommand } from "@/components/search-command";
import { MainView } from "./_components/main-view";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
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
