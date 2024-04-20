export interface Folder {
  id?: string;
  title: string;
  userId: string;
  parentFolderId?: string | null; // Use null for root folders
}
