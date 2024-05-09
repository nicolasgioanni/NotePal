const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full px-6 py-5 overflow-auto">
      <div className="">{children}</div>
    </main>
  );
};

export default DashboardLayout;
