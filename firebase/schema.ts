interface Document {
  title: string;
  userId: string;
  isArchived: boolean;
  parentDocument?: string; // Optional, ID of another document
  content?: string; // Optional
  coverImage?: string; // Optional
  icon?: string; // Optional
  isPublished: boolean;
}
