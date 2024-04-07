import LogInBody from "./_components/body";

const LogInPage = () => {
  return (
    <div className="flex justify-center">
      <div
        className="flex flex-col items-center justify-center 
            md:justify-start text-center gap-y-8 flex-1 px-6 pb-10"
      >
        <LogInBody />
      </div>
    </div>
  );
};

export default LogInPage;
