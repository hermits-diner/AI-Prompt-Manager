import type { LucideIcon } from 'lucide-react';

export type AICategoryId = 'llm' | 'image' | 'sound' | 'vlm';

export interface AIService {
  id: string;
  name: string;
  url: string;
  icon?: LucideIcon;
  color?: string;
}

export interface AICategory {
  id: AICategoryId;
  label: string;
  services: AIService[];
}
