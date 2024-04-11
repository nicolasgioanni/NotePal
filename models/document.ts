export interface Document {
  id?: string; // Optional because Firestore generates this
  title: string;
  userId: string;
  isArchived: boolean;
  parentFolder?: string; // Use null for root documents
  content: string; // Assuming JSON string for simplicity
  icon?: string;
  isPublished: boolean;
}
