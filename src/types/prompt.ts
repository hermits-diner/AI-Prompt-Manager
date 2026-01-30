export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  favorite: boolean;
}

export interface PromptFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
}
