import { useState, useEffect, useCallback } from 'react';
import type { Prompt, PromptFormData } from '@/types/prompt';
import { SEED_PROMPTS } from '@/data/seedPrompts';

const STORAGE_KEY = 'prompt-manager-data';

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount; first time use seed prompts
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPrompts(parsed);
      } catch (e) {
        console.error('Failed to parse stored prompts:', e);
        setPrompts(SEED_PROMPTS);
      }
    } else {
      setPrompts(SEED_PROMPTS);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever prompts change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
    }
  }, [prompts, isLoaded]);

  const addPrompt = useCallback((data: PromptFormData) => {
    const newPrompt: Prompt = {
      id: crypto.randomUUID(),
      title: data.title,
      content: data.content,
      category: data.category || '미분류',
      tags: Array.isArray(data.tags) ? data.tags : [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      favorite: false,
    };
    setPrompts(prev => [newPrompt, ...prev]);
    return newPrompt.id;
  }, []);

  const addPrompts = useCallback((dataList: PromptFormData[]) => {
    const now = Date.now();
    const newPrompts: Prompt[] = dataList.map((data) => ({
      id: crypto.randomUUID(),
      title: data.title,
      content: data.content,
      category: data.category || '미분류',
      tags: Array.isArray(data.tags) ? data.tags : [],
      createdAt: now,
      updatedAt: now,
      favorite: false,
    }));
    setPrompts(prev => [...newPrompts, ...prev]);
    return newPrompts.length;
  }, []);

  const updatePrompt = useCallback((id: string, data: PromptFormData) => {
    setPrompts(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              title: data.title,
              content: data.content,
              category: data.category || p.category,
              tags: Array.isArray(data.tags) ? data.tags : p.tags,
              updatedAt: Date.now(),
            }
          : p
      )
    );
  }, []);

  const deletePrompt = useCallback((id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setPrompts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, favorite: !p.favorite } : p
      )
    );
  }, []);

  const duplicatePrompt = useCallback((id: string) => {
    const prompt = prompts.find(p => p.id === id);
    if (prompt) {
      const newPrompt: Prompt = {
        ...prompt,
        id: crypto.randomUUID(),
        title: `${prompt.title} (복사)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        favorite: false,
      };
      setPrompts(prev => [newPrompt, ...prev]);
      return newPrompt.id;
    }
    return null;
  }, [prompts]);

  return {
    prompts,
    isLoaded,
    addPrompt,
    addPrompts,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    duplicatePrompt,
  };
}
