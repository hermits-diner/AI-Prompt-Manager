export interface Category {
  id: string;
  name: string;
  color?: string;
  createdAt: number;
}

export interface CategoryFormData {
  name: string;
  color?: string;
}

// 고등학교 교사용 기본 카테고리 (초기 데이터)
const BASE_TS = 1700000000000; // 고정 기준 시각
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'default-teaching', name: '수업·강의', createdAt: BASE_TS },
  { id: 'default-assessment', name: '평가·채점', createdAt: BASE_TS + 1 },
  { id: 'default-guidance', name: '학습지도·상담', createdAt: BASE_TS + 2 },
  { id: 'default-class', name: '학급·행정', createdAt: BASE_TS + 3 },
  { id: 'default-materials', name: '자료·연구', createdAt: BASE_TS + 4 },
];
