import { JSONContent } from "novel";

export interface Document {
  id?: string;
  title: string;
  userId: string;
  parentFolderId?: string | null; // Use null for root documents
  content: JSONContent | null;
  icon?: string;
  isPublished: boolean;
}
