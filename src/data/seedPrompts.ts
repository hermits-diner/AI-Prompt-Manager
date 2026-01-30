import type { Prompt } from '@/types/prompt';

const BASE_TS = 1700000000000;

/** 고등학교 교사용 예시 프롬프트 (카테고리별 2개씩, 총 10개) */
export const SEED_PROMPTS: Prompt[] = [
  // 수업·강의 (2개)
  {
    id: 'seed-teaching-1',
    title: '개념을 학생 수준으로 설명해 달라',
    content: `다음 개념을 고등학생이 이해할 수 있도록 쉽게 설명해 주세요.
- 어려운 용어는 비유나 일상 예시를 들어 설명해 주세요.
- 단계별로 나누어 3~5문장 이내로 요약해 주세요.

[여기에 설명할 개념이나 단원명을 입력하세요]`,
    category: '수업·강의',
    tags: ['개념설명', '수업', '비유'],
    createdAt: BASE_TS,
    updatedAt: BASE_TS,
    favorite: false,
  },
  {
    id: 'seed-teaching-2',
    title: '수업용 토론·활동 주제 생성',
    content: `다음 단원/주제에 맞는 수업용 토론 주제 또는 소규모 활동 주제를 3개 제안해 주세요.
- 학생들이 찬반이나 의견을 나눌 수 있는 질문 형태로 작성해 주세요.
- 예상 소요 시간과 진행 방법을 한 줄씩 첨부해 주세요.

[단원명 또는 주제를 입력하세요]`,
    category: '수업·강의',
    tags: ['토론', '활동', '수업설계'],
    createdAt: BASE_TS + 1,
    updatedAt: BASE_TS + 1,
    favorite: false,
  },
  // 평가·채점 (2개)
  {
    id: 'seed-assessment-1',
    title: '서술형 문항 출제',
    content: `다음 학습 목표에 맞는 서술형 문항을 2문항 출제해 주세요.
- 문항별 배점과 채점 포인트(핵심 키워드·개념)를 함께 제시해 주세요.
- 고등학교 [학년/과목] 수준으로 난이도를 맞춰 주세요.

[학습 목표 또는 단원을 입력하세요]`,
    category: '평가·채점',
    tags: ['서술형', '출제', '채점기준'],
    createdAt: BASE_TS + 2,
    updatedAt: BASE_TS + 2,
    favorite: false,
  },
  {
    id: 'seed-assessment-2',
    title: '채점 기준표(루브릭) 작성',
    content: `다음 과제/발표에 대한 채점 루브릭을 만들어 주세요.
- 평가 항목 3~5개, 각 항목당 3~4단계 수준(우수/보통/미흡 등)으로 구분해 주세요.
- 각 단계에 대한 구체적인 설명을 한 줄씩 적어 주세요.

[과제명 또는 평가 대상 활동을 입력하세요]`,
    category: '평가·채점',
    tags: ['루브릭', '채점', '평가'],
    createdAt: BASE_TS + 3,
    updatedAt: BASE_TS + 3,
    favorite: false,
  },
  // 학습지도·상담 (2개)
  {
    id: 'seed-guidance-1',
    title: '학습 조언 답변 초안',
    content: `학생/학부모로부터 다음과 같은 학습 고민을 제기받았다고 가정하고, 상담 답변 초안을 작성해 주세요.
- 공감 한 줄 + 구체적 조언 2~3가지 + 마무리 격려로 구성해 주세요.
- 학교 현장에서 바로 참고할 수 있는 실천 가능한 내용으로 작성해 주세요.

[고민 내용을 입력하세요]`,
    category: '학습지도·상담',
    tags: ['상담', '학습조언', '멘토링'],
    createdAt: BASE_TS + 4,
    updatedAt: BASE_TS + 4,
    favorite: false,
  },
  {
    id: 'seed-guidance-2',
    title: '진로·진학 상담 참고 답변',
    content: `다음과 같은 진로/진학 관련 질문에 대해, 상담 시 참고할 수 있는 답변 포인트를 정리해 주세요.
- 관련 정보(전형, 과목, 기관 등)를 요약하고, 학생에게 전달할 핵심 메시지 2~3가지를 bullet로 제시해 주세요.

[학생의 질문 또는 관심 분야를 입력하세요]`,
    category: '학습지도·상담',
    tags: ['진로', '진학', '상담'],
    createdAt: BASE_TS + 5,
    updatedAt: BASE_TS + 5,
    favorite: false,
  },
  // 학급·행정 (2개)
  {
    id: 'seed-class-1',
    title: '학부모 상담/안내문 초안',
    content: `다음 상황에 맞는 학부모 대상 안내문 또는 상담 시 참고할 말씀 초안을 작성해 주세요.
- 존댓말, 공식적인 톤을 유지해 주세요.
- 일시·장소·준비물·문의처 등 필요한 항목을 포함해 주세요.

[안내할 일정·행사·상담 주제를 입력하세요]`,
    category: '학급·행정',
    tags: ['학부모', '안내문', '공지'],
    createdAt: BASE_TS + 6,
    updatedAt: BASE_TS + 6,
    favorite: false,
  },
  {
    id: 'seed-class-2',
    title: '학급 규칙·공지 문구',
    content: `다음 내용을 학급 게시나 SNS 공지용으로 쓸 수 있는 짧은 문구로 다듬어 주세요.
- 2~3문장 이내로, 학생이 한눈에 이해할 수 있게 작성해 주세요.
- 필요 시 주의·당부 문구 한 줄을 추가해 주세요.

[공지할 내용을 입력하세요]`,
    category: '학급·행정',
    tags: ['학급규칙', '공지', '문구'],
    createdAt: BASE_TS + 7,
    updatedAt: BASE_TS + 7,
    favorite: false,
  },
  // 자료·연구 (2개)
  {
    id: 'seed-materials-1',
    title: '워크시트·활동지 문항 생성',
    content: `다음 단원/주제에 맞는 워크시트 또는 활동지용 문항을 5개 만들어 주세요.
- 빈칸 채우기, O/X, 단답형, 1~2줄 서술 등 형태를 섞어 주세요.
- 문항 아래에 답 또는 참고 답안을 괄호로 표시해 주세요.

[단원명 또는 주제를 입력하세요]`,
    category: '자료·연구',
    tags: ['워크시트', '활동지', '문항'],
    createdAt: BASE_TS + 8,
    updatedAt: BASE_TS + 8,
    favorite: false,
  },
  {
    id: 'seed-materials-2',
    title: '수업 참고 자료 요약·정리',
    content: `아래 글/자료를 수업 준비용으로 A4 한 페이지 분량으로 요약·정리해 주세요.
- 핵심 개념, 수업에 활용할 수 있는 발문 2~3개, 주의할 점을 구분해 정리해 주세요.

[요약할 자료 내용 또는 링크 설명을 입력하세요]`,
    category: '자료·연구',
    tags: ['요약', '자료정리', '수업준비'],
    createdAt: BASE_TS + 9,
    updatedAt: BASE_TS + 9,
    favorite: false,
  },
];
