export interface AILinkCategory {
  id: string;
  name: string;
  order: number; // 표시 순서: LLM(0), VLM(1), SOUND AI(2), 기타(3)
  createdAt: number;
}

export interface AILink {
  id: string;
  categoryId: string;
  name: string;
  url: string;
  color?: string;
  createdAt: number;
}

export interface AILinkCategoryFormData {
  name: string;
  order?: number;
}

export interface AILinkFormData {
  categoryId: string;
  name: string;
  url: string;
  color?: string;
}
