import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { EditorInstance } from "novel";

export async function getChunksFromMarkdown(markdown: string) {
  const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const output = await splitter.createDocuments([markdown]);

  return output;
}
