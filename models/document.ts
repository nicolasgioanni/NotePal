export interface Document {
  id?: string;
  title: string;
  userId: string;
  isArchived: boolean;
  parentFolderId?: string | null; // Use null for root documents
  content: string; // Assuming JSON string for simplicity
  icon?: string;
  isPublished: boolean;
}
