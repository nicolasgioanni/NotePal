"use client";
import { defaultEditorContent } from "@/lib/content";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
  EditorInstance,
  EditorCommandList,
  useEditor,
} from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { defaultExtensions } from "./extensions";
import { Separator } from "../ui/separator";
import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { ColorSelector } from "./selectors/color-selector";

import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";
import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { handleImageDrop, handleImagePaste } from "novel/plugins";
import { updateDoc, doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "@/db/firebase/config";
import { Document } from "@/models/types";
import { LoadingSkeleton } from "./loading-skeleton";
import {
  getDocumentById,
  updateDocument,
  updateDocumentContent,
} from "@/db/firebase/document";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useDocumentById } from "@/hooks/use-document-by-id";
import { Skeleton } from "@/components/ui/skeleton";
import { getChunksFromMarkdown } from "@/lib/markdown-chunker";
import pinecone, { pineconeDB } from "@/db/pinecone/pinecone";
import {
  generateAndStoreEmbeddings,
  getEmbeddingsForDoc,
} from "@/lib/vector-store";

const extensions = [...defaultExtensions, slashCommand];

interface EditorProps {
  initialData?: Document;
}

const Editor = ({ initialData }: EditorProps) => {
  const [saveStatus, setSaveStatus] = useState("Saved");
  const user = useCurrentUser();
  const [error, setError] = useState<string | null>(null);
  const [hasContentChanged, setHasContentChanged] = useState(false);

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      // Save the content to firebase here

      if (!user || !initialData || !initialData.id) return;

      await updateDocumentContent(
        initialData.id,
        editor.storage.markdown.getMarkdown()
      )
        .then(() => {
          setSaveStatus("Saved");
        })
        .catch((error) => {
          console.error("Error updating document content: ", error);
          setSaveStatus("Error");
        });

      setSaveStatus("Saved");
    },
    750
  );

  const updateEmbedding = async (editor: EditorInstance) => {
    if (!user || !initialData || !initialData.id) return;
    const markdown = editor.storage.markdown.getMarkdown();
    await generateAndStoreEmbeddings(initialData.id, markdown).catch(
      (error) => {
        console.error("Error generating embeddings: ", error);
      }
    );
  };

  if (!initialData) {
    return (
      <div className="flex flex-col px-12 py-[25px] gap-y-6">
        <Skeleton className="h-8 w-full rounded-2xl" />
        <Skeleton className="h-8 w-5/6 rounded-2xl" />
        <Skeleton className="h-8 w-11/12 rounded-2xl" />
        <Skeleton className="h-8 w-2/3 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return <div>Something went wrong!</div>;
  }

  return (
    <div className="w-full">
      <EditorRoot>
        <EditorContent
          initialContent={undefined}
          extensions={extensions}
          className="relative min-h-[500px] w-full sm:mb-[calc(20vh)]"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },

            attributes: {
              class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
            setHasContentChanged(true);
            setSaveStatus("Unsaved");
          }}
          slotAfter={<ImageResizer />}
          onBlur={({ editor }) => {
            if (hasContentChanged) {
              updateEmbedding(editor);
              setHasContentChanged(false);
            }
          }}
          onCreate={({ editor }) => {
            editor.commands.setContent(initialData.markdown);
            updateEmbedding(editor);
          }}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <GenerativeMenuSwitch
            open={openAI}
            onOpenChange={setOpenAI}
          >
            <Separator orientation="vertical" />
            <NodeSelector
              open={openNode}
              onOpenChange={setOpenNode}
            />
            <Separator orientation="vertical" />

            <LinkSelector
              open={openLink}
              onOpenChange={setOpenLink}
            />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector
              open={openColor}
              onOpenChange={setOpenColor}
            />
          </GenerativeMenuSwitch>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default Editor;
