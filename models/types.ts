import { JSONContent } from "novel";

interface Document {
  id?: string;
  title: string;
  userId: string;
  parentFolderId: string | null;
  content: JSONContent | null;
  isPublished: boolean;
}

interface DocumentUpdateData {
  title?: string;
  content?: JSONContent | null;
  parentFolderId?: string | null;
  isPublished?: boolean;
}

interface DocumentCreateData {
  title?: string;
  content?: JSONContent | null;
  parentFolderId?: string | null;
}

interface Folder {
  id?: string;
  title: string;
  userId: string;
  parentFolderId?: string | null;
}

interface FolderUpdateData {
  title?: string;
  parentFolderId?: string | null;
}

interface FolderCreateData {
  title: string;
  parentFolderId?: string | null;
}

export type {
  Document,
  DocumentUpdateData,
  DocumentCreateData,
  Folder,
  FolderUpdateData,
  FolderCreateData,
};
