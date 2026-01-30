import { useState, useEffect } from 'react';
import type { Prompt, PromptFormData } from '@/types/prompt';
import type { Category } from '@/types/category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Save, FolderCog, AlertCircle } from 'lucide-react';

interface PromptFormProps {
  prompt?: Prompt | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PromptFormData) => void;
  onManageCategories?: () => void;
}

export function PromptForm({ 
  prompt, 
  categories, 
  isOpen, 
  onClose, 
  onSubmit,
  onManageCategories 
}: PromptFormProps) {
  const [formData, setFormData] = useState<PromptFormData>({
    title: '',
    content: '',
    category: '',
    tags: [],
  });
  const [newTag, setNewTag] = useState('');

  // Get default category (first one or '미분류')
  const getDefaultCategory = () => {
    if (categories.length > 0) {
      return categories[0].name;
    }
    return '미분류';
  };

  useEffect(() => {
    if (!isOpen) return;
    
    if (prompt) {
      setFormData({
        title: prompt.title,
        content: prompt.content,
        category: prompt.category || getDefaultCategory(),
        tags: [...prompt.tags],
      });
    } else {
      setFormData({
        title: '',
        content: '',
        category: getDefaultCategory(),
        tags: [],
      });
    }
  }, [prompt, isOpen]);

  // Update category when categories change (for new prompt)
  useEffect(() => {
    if (!isOpen) return;
    if (!prompt && categories.length > 0 && !formData.category) {
      setFormData(prev => ({ ...prev, category: categories[0].name }));
    }
  }, [categories, isOpen, prompt, formData.category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.content.trim()) {
      const submitData: PromptFormData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category || getDefaultCategory(),
        tags: Array.isArray(formData.tags) ? formData.tags : [],
      };
      onSubmit(submitData);
      onClose();
    }
  };

  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, trimmed] }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const hasCategories = categories.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{prompt ? '프롬프트 수정' : '새 프롬프트'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, title: e.target.value }))
              }
              placeholder="프롬프트 제목을 입력하세요"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="category">카테고리</Label>
              {onManageCategories && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-muted-foreground"
                  onClick={onManageCategories}
                >
                  <FolderCog className="h-3 w-3 mr-1" />
                  카테고리 관리
                </Button>
              )}
            </div>
            
            {!hasCategories ? (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>등록된 카테고리가 없습니다. 카테고리를 먼저 추가해주세요.</span>
              </div>
            ) : (
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">프롬프트 내용 *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, content: e.target.value }))
              }
              placeholder="프롬프트 내용을 입력하세요..."
              className="min-h-[200px] resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">태그 (선택)</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="태그를 입력하고 Enter (선택)"
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => removeTag(tag)}
                  >
                    #{tag}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button 
              type="submit" 
              disabled={!hasCategories}
            >
              <Save className="h-4 w-4 mr-2" />
              {prompt ? '수정하기' : '저장하기'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
