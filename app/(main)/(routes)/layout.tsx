import { SearchCommand } from "@/components/search-command";
import { MainView } from "./_components/main-view";
import { auth } from "@/auth";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
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
