const FlashcardsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full px-6 py-5 overflow-y-auto">
      <div>{children}</div>
    </main>
  );
};

export default FlashcardsLayout;
