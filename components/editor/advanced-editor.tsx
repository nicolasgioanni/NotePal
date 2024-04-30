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
import { updateDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/db/firebase/config";
import { Document } from "@/models/types";
import { LoadingSkeleton } from "./loading-skeleton";
import {
  testFunction,
  updateDocument,
  updateDocumentContent,
} from "@/db/firebase/document";

const extensions = [...defaultExtensions, slashCommand];

interface EditorProps {
  initialData: Document;
}

const Editor = ({ initialData }: EditorProps) => {
  const [content, setContent] = useState<JSONContent | null>(null);
  const [saveStatus, setSaveStatus] = useState("Saved");

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  useEffect(() => {
    if (initialData.content) {
      setContent(initialData.content);
    } else {
      setContent(defaultEditorContent);
    }
  }, [initialData]);

  function cleanJSON(json: JSONContent) {
    if (!json) return json;

    // If the json object contains 'attrs', handle it
    if (json.attrs) {
      // You can delete it to test without it
      delete json.attrs;
      // Or modify it in a way you suspect might be more "safe" to handle
      // json.attrs = { safeKey: json.attrs.problematicKey };
    }

    // Recursively clean content arrays
    if (json.content) {
      json.content = json.content.map(cleanJSON);
    }

    // Optionally handle other structures such as marks or specific nested properties
    if (json.marks) {
      json.marks = json.marks.map((mark) => {
        if (mark.attrs) {
          delete mark.attrs; // Or modify as needed
        }
        return mark;
      });
    }

    return json;
  }

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      console.log({ json });
      // Save the content to firebase here
      if (!initialData.id) return;

      const jsonString = JSON.stringify(json);

      await updateDocumentContent(initialData.id, jsonString)
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
