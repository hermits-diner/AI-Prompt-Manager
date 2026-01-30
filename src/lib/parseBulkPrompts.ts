import type { PromptFormData } from '@/types/prompt';

const DEFAULT_CATEGORY = '미분류';

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((t): t is string => typeof t === 'string').map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof value === 'string' && value.trim()) {
    return value.split('|').map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

function toFormData(raw: Record<string, unknown>): PromptFormData | null {
  const title = typeof raw.title === 'string' ? raw.title.trim() : String(raw.title ?? '').trim();
  const content = typeof raw.content === 'string' ? raw.content.trim() : String(raw.content ?? '').trim();
  if (!title || !content) return null;

  const category =
    typeof raw.category === 'string' && raw.category.trim()
      ? raw.category.trim()
      : DEFAULT_CATEGORY;
  const tags = normalizeTags(raw.tags);

  return { title, content, category, tags };
}

/**
 * JSON 문자열을 파싱하여 PromptFormData[] 반환.
 * 유효하지 않은 항목은 제외.
 */
export function parseJsonImport(text: string): PromptFormData[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) return [];

    const result: PromptFormData[] = [];
    for (const item of parsed) {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        const normalized = toFormData(item as Record<string, unknown>);
        if (normalized) result.push(normalized);
      }
    }
    return result;
  } catch {
    return [];
  }
}

/**
 * CSV 한 줄 파싱 (쉼표 구분, 따옴표 처리)
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (inQuotes) {
      current += char;
    } else if (char === ',') {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * CSV 문자열을 파싱하여 PromptFormData[] 반환.
 * 첫 줄은 헤더(title, content, category, tags)로 간주.
 */
export function parseCsvImport(text: string): PromptFormData[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const lines = trimmed.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];

  const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/^\s*|\s*$/g, ''));
  const titleIdx = header.indexOf('title');
  const contentIdx = header.indexOf('content');
  const categoryIdx = header.indexOf('category');
  const tagsIdx = header.indexOf('tags');

  if (titleIdx === -1 || contentIdx === -1) return [];

  const result: PromptFormData[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i]);
    const raw: Record<string, unknown> = {
      title: cells[titleIdx] ?? '',
      content: cells[contentIdx] ?? '',
      category: categoryIdx >= 0 ? (cells[categoryIdx] ?? '') : '',
      tags: tagsIdx >= 0 ? (cells[tagsIdx] ?? '') : '',
    };
    const normalized = toFormData(raw);
    if (normalized) result.push(normalized);
  }
  return result;
}

/**
 * 텍스트가 JSON 배열인지 추정 (첫 비공백 문자가 '[')
 */
export function looksLikeJson(text: string): boolean {
  return /^\s*\[/.test(text);
}

/**
 * 자동 감지 후 파싱. JSON이면 parseJsonImport, 아니면 parseCsvImport.
 */
export function parseBulkImport(text: string): PromptFormData[] {
  const t = text.trim();
  if (!t) return [];
  return looksLikeJson(t) ? parseJsonImport(text) : parseCsvImport(text);
}
