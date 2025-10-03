// in src/types.ts

export interface Tag {
  id: number;
  name: string;
}

export interface Entry {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  aiDetectedMood?: string | null;
  mediaUrl?: string | null;
  mediaType?: string | null;
  tags: Tag[];
}