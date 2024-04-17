export interface Folder {
  id?: string;
  name: string;
  userId: string;
  parentFolderId?: string | null; // Use null for root folders
}
