import { JSONContent } from "novel";

interface Document {
  id?: string;
  title: string;
  userId: string;
  parentFolderId: string | null;
  content: JSONContent | null;
  isPublished: boolean;
  createdAt: Date;
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
  createdAt: Date;
}

interface FolderUpdateData {
  title?: string;
  parentFolderId?: string | null;
}

interface FolderCreateData {
  title?: string;
  parentFolderId?: string | null;
}

interface UserUpdateData {
  name?: string;
  photoURL?: string;
  emailVerified?: Date;
}

export type {
  Document,
  DocumentUpdateData,
  DocumentCreateData,
  Folder,
  FolderUpdateData,
  FolderCreateData,
  UserUpdateData,
};
