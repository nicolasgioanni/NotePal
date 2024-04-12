export interface Folder {
  id?: string;
  name: string;
  userId: string;
  isArchived: boolean;
  parentFolderId?: string | null; // Use null for root folders
}
