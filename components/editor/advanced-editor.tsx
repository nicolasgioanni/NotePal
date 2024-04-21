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
import { uploadFn } from "./image-upload";
import { updateDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Document } from "@/models/document";
import { LoadingSkeleton } from "./loading-skeleton";

const extensions = [...defaultExtensions, slashCommand];

interface EditorProps {
  docId: string;
}

const Editor = ({ docId }: EditorProps) => {
  const [content, setContent] = useState<JSONContent | null>(null);
  const [saveStatus, setSaveStatus] = useState("Saved");

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  useEffect(() => {
    const docRef = doc(db, "documents", docId);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Document;
        if (data.content) {
          setContent(data.content);
        } else {
          console.log("Document does not contain valid JSONContent");
          setContent(defaultEditorContent);
        }
      } else {
        console.log("No such document!");
        setContent(null); // Fallback content if document doesn't exist
      }
    });

    return () => unsubscribe(); // Cleanup the subscription
  }, [docId]);

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      const docRef = doc(db, "documents", docId);
      // Save the content to firebase here
      await updateDoc(docRef, { content: json })
        .then(() => {
          setSaveStatus("Saved");
        })
        .catch((error) => {
          console.error("Error updating document content: ", error);
          setSaveStatus("Error");
        });

      setSaveStatus("Saved");
    },
    500
  );

  if (!content) {
    return (
      <div className="px-8 sm:px-12 py-12">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full">
      <EditorRoot>
        <EditorContent
          initialContent={content}
          extensions={extensions}
          className="relative min-h-[500px] w-full sm:mb-[calc(20vh)]"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
            setSaveStatus("Unsaved");
          }}
          slotAfter={<ImageResizer />}
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
