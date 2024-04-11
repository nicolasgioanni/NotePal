export interface Folder {
  id?: string; // Optional because Firestore generates this
  name: string;
  userId: string;
  isArchived: boolean;
  parentFolder?: string; // Use null for root folders
  icon: string;
  isPublished: boolean;
}
