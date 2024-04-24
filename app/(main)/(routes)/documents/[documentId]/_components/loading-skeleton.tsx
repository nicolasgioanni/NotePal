import { DocTitle } from "./doc-title";
import { EditorContent } from "./editor-content";

export const LoadingSkeleton = () => {
  return (
    <>
      <DocTitle.Skeleton />
      <EditorContent.Skeleton />
    </>
  );
};
