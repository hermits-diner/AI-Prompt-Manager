import { useState, useEffect, useCallback } from 'react';
import type { Category, CategoryFormData } from '@/types/category';
import { DEFAULT_CATEGORIES } from '@/types/category';

const STORAGE_KEY = 'prompt-manager-categories';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCategories(parsed);
      } catch (e) {
        console.error('Failed to parse stored categories:', e);
        setCategories(DEFAULT_CATEGORIES);
      }
    } else {
      // First time - use default categories
      setCategories(DEFAULT_CATEGORIES);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever categories change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    }
  }, [categories, isLoaded]);

  const addCategory = useCallback((data: CategoryFormData) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: Date.now(),
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory.id;
  }, []);

  const updateCategory = useCallback((id: string, data: CategoryFormData) => {
    setCategories(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, ...data }
          : c
      )
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  const resetToDefaults = useCallback(() => {
    setCategories(DEFAULT_CATEGORIES);
  }, []);

  // Get category name by id
  const getCategoryName = useCallback((id: string) => {
    return categories.find(c => c.id === id)?.name || '';
  }, [categories]);

  // Get category id by name (for backward compatibility)
  const getCategoryIdByName = useCallback((name: string) => {
    return categories.find(c => c.name === name)?.id || '';
  }, [categories]);

  return {
    categories,
    isLoaded,
    addCategory,
    updateCategory,
    deleteCategory,
    resetToDefaults,
    getCategoryName,
    getCategoryIdByName,
  };
}
