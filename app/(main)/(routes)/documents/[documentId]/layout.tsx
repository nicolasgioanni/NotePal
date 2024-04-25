"use client";
import { Navbar } from "./_components/_navbar/navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDocumentById } from "@/hooks/use-document-by-id";
import { redirect, useParams, useRouter } from "next/navigation";

const EditorLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const { document, isLoading, error } = useDocumentById(
    params.documentId as string
  );
  const router = useRouter();

  if (!document && !isLoading) {
    redirect("/documents");
  }

  return (
    <div className="h-full flex flex-col">
      {isLoading ? <Navbar.Skeleton /> : <Navbar initialData={document!} />}

      <ScrollArea>
        <main className="h-full px-8">{children}</main>
      </ScrollArea>
    </div>
  );
};

export default EditorLayout;
