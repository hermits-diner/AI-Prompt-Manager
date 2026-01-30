import { useState, useEffect, useCallback } from 'react';
import type {
  AILinkCategory,
  AILink,
  AILinkCategoryFormData,
  AILinkFormData,
} from '@/types/aiLink';

const STORAGE_KEY_CATEGORIES = 'ai-browser-link-categories';
const STORAGE_KEY_LINKS = 'ai-browser-links';

const CATEGORY_ORDER = ['채팅·작문', '이미지', '음악·음성', '도구·기타'] as const;

function createDefaultData(): { categories: AILinkCategory[]; links: AILink[] } {
  const now = Date.now();
  const catChat = crypto.randomUUID();
  const catImage = crypto.randomUUID();
  const catAudio = crypto.randomUUID();
  const catTools = crypto.randomUUID();
  const categories: AILinkCategory[] = [
    { id: catChat, name: '채팅·작문', order: 0, createdAt: now },
    { id: catImage, name: '이미지', order: 1, createdAt: now },
    { id: catAudio, name: '음악·음성', order: 2, createdAt: now },
    { id: catTools, name: '도구·기타', order: 3, createdAt: now },
  ];
  const links: AILink[] = [
    { id: crypto.randomUUID(), categoryId: catChat, name: 'Gemini', url: 'https://gemini.google.com', color: 'text-blue-600', createdAt: now },
    { id: crypto.randomUUID(), categoryId: catChat, name: 'ChatGPT', url: 'https://chat.openai.com', color: 'text-emerald-600', createdAt: now },
    { id: crypto.randomUUID(), categoryId: catChat, name: 'Claude', url: 'https://claude.ai', color: 'text-orange-600', createdAt: now },
    { id: crypto.randomUUID(), categoryId: catChat, name: 'Copilot', url: 'https://copilot.microsoft.com', color: 'text-sky-600', createdAt: now },
    { id: crypto.randomUUID(), categoryId: catChat, name: 'DeepSeek', url: 'https://chat.deepseek.com', color: 'text-slate-700', createdAt: now },
    { id: crypto.randomUUID(), categoryId: catChat, name: 'NotebookLM', url: 'https://notebooklm.google.com', color: 'text-green-600', createdAt: now },
    { id: crypto.randomUUID(), categoryId: catImage, name: 'DALL·E', url: 'https://chat.openai.com', color: 'text-emerald-600', createdAt: now },
    { id: crypto.randomUUID(), categoryId: catImage, name: 'Midjourney', url: 'https://www.midjourney.com', color: 'text-violet-600', createdAt: now },
    { id: crypto.randomUUID(), categoryId: catImage, name: 'Ideogram', url: 'https://ideogram.ai', color: 'text-pink-600', createdAt: now },
    { id: crypto.randomUUID(), categoryId: catAudio, name: 'Suno', url: 'https://suno.com', color: 'text-amber-500', createdAt: now },
    { id: crypto.randomUUID(), categoryId: catAudio, name: 'Udio', url: 'https://udio.com', color: 'text-indigo-600', createdAt: now },
    { id: crypto.randomUUID(), categoryId: catAudio, name: 'ElevenLabs', url: 'https://elevenlabs.io', color: 'text-orange-600', createdAt: now },
    { id: crypto.randomUUID(), categoryId: catTools, name: 'Flux', url: 'https://flux.ai', color: 'text-rose-600', createdAt: now },
    { id: crypto.randomUUID(), categoryId: catTools, name: 'Leonardo', url: 'https://leonardo.ai', color: 'text-amber-600', createdAt: now },
    { id: crypto.randomUUID(), categoryId: catTools, name: 'Grok', url: 'https://x.com/i/grok', color: 'text-gray-800', createdAt: now },
  ];
  return { categories, links };
}

export function useAILinks() {
  const [categories, setCategories] = useState<AILinkCategory[]>([]);
  const [links, setLinks] = useState<AILink[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedCat = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    const storedLinks = localStorage.getItem(STORAGE_KEY_LINKS);
    if (storedCat && storedLinks) {
      try {
        const parsedCat = JSON.parse(storedCat) as (AILinkCategory & { order?: number })[];
        const parsedLinks = JSON.parse(storedLinks) as AILink[];
        const withOrder: AILinkCategory[] = parsedCat.map((c, i) => ({
          ...c,
          order: c.order ?? (CATEGORY_ORDER.includes(c.name as (typeof CATEGORY_ORDER)[number]) ? CATEGORY_ORDER.indexOf(c.name as (typeof CATEGORY_ORDER)[number]) : 99 + i),
        }));
        setCategories(withOrder.sort((a, b) => a.order - b.order));
        setLinks(parsedLinks);
      } catch (e) {
        console.error('Failed to parse stored AI links:', e);
        const def = createDefaultData();
        setCategories(def.categories);
        setLinks(def.links);
      }
    } else {
      const def = createDefaultData();
      setCategories(def.categories);
      setLinks(def.links);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
      localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(links));
    }
  }, [categories, links, isLoaded]);

  const addCategory = useCallback((data: AILinkCategoryFormData) => {
    const newCat: AILinkCategory = {
      id: crypto.randomUUID(),
      name: data.name.trim(),
      order: 99,
      createdAt: Date.now(),
    };
    setCategories((prev) => {
      const maxOrder = prev.reduce((max, c) => Math.max(max, c.order ?? 0), -1);
      newCat.order = data.order ?? maxOrder + 1;
      return [...prev, newCat].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    });
    return newCat.id;
  }, []);

  const updateCategory = useCallback((id: string, data: AILinkCategoryFormData) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: data.name.trim(), order: data.order ?? c.order } : c)).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setLinks((prev) => prev.filter((l) => l.categoryId !== id));
  }, []);

  const addLink = useCallback((data: AILinkFormData) => {
    const newLink: AILink = {
      id: crypto.randomUUID(),
      categoryId: data.categoryId,
      name: data.name.trim(),
      url: data.url.trim(),
      color: data.color,
      createdAt: Date.now(),
    };
    setLinks((prev) => [newLink, ...prev]);
    return newLink.id;
  }, []);

  const updateLink = useCallback((id: string, data: AILinkFormData) => {
    setLinks((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              categoryId: data.categoryId,
              name: data.name.trim(),
              url: data.url.trim(),
              color: data.color,
            }
          : l
      )
    );
  }, []);

  const deleteLink = useCallback((id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const resetToDefaults = useCallback(() => {
    const def = createDefaultData();
    setCategories(def.categories);
    setLinks(def.links);
  }, []);

  const getLinksByCategory = useCallback(
    (categoryId: string) => links.filter((l) => l.categoryId === categoryId),
    [links]
  );

  return {
    categories,
    links,
    isLoaded,
    addCategory,
    updateCategory,
    deleteCategory,
    addLink,
    updateLink,
    deleteLink,
    resetToDefaults,
    getLinksByCategory,
  };
}
