import { useState, useEffect, useRef } from 'react';
import type { AILinkCategory, AILink, AILinkFormData } from '@/types/aiLink';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Link2,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  RotateCcw,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

const COLOR_OPTIONS = [
  { value: '', label: '기본' },
  { value: 'text-blue-600', label: '파랑' },
  { value: 'text-emerald-600', label: '초록' },
  { value: 'text-orange-600', label: '주황' },
  { value: 'text-violet-600', label: '보라' },
  { value: 'text-pink-600', label: '분홍' },
  { value: 'text-amber-500', label: '노랑' },
];

interface AILinkManagerProps {
  categories: AILinkCategory[];
  links: AILink[];
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (data: { name: string }) => void;
  onUpdateCategory: (id: string, data: { name: string }) => void;
  onDeleteCategory: (id: string) => void;
  onAddLink: (data: AILinkFormData) => void;
  onUpdateLink: (id: string, data: AILinkFormData) => void;
  onDeleteLink: (id: string) => void;
  onReset: () => void;
  getLinksByCategory: (categoryId: string) => AILink[];
}

export function AILinkManager({
  categories,
  links,
  isOpen,
  onClose,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onReset,
  getLinksByCategory,
}: AILinkManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [addLinkCategoryId, setAddLinkCategoryId] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<AILink | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'category' | 'link'; id: string; name?: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  const applyTransform = (x: number, y: number) => {
    if (contentRef.current) {
      contentRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    }
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
      posRef.current = { x: posRef.current.x + dx, y: posRef.current.y + dy };
      applyTransform(posRef.current.x, posRef.current.y);
    };
    const onMouseUp = () => {
      setDragPosition({ ...posRef.current });
      setIsDragging(false);
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (isOpen) {
      setDragPosition({ x: 0, y: 0 });
      posRef.current = { x: 0, y: 0 };
    }
  }, [isOpen]);

  const handleDragStart = (e: React.MouseEvent) => {
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    posRef.current = { ...dragPosition };
    applyTransform(posRef.current.x, posRef.current.y);
    setIsDragging(true);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory({ name: newCategoryName.trim() });
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };

  const handleUpdateCategory = () => {
    if (editingCategoryId && editingCategoryName.trim()) {
      onUpdateCategory(editingCategoryId, { name: editingCategoryName.trim() });
      setEditingCategoryId(null);
      setEditingCategoryName('');
    }
  };

  const handleStartEditCategory = (cat: AILinkCategory) => {
    setEditingCategoryId(cat.id);
    setEditingCategoryName(cat.name);
  };

  const handleAddLink = (categoryId: string) => {
    setAddLinkCategoryId(categoryId);
  };

  const handleSaveNewLink = (name: string, url: string, color?: string) => {
    if (addLinkCategoryId && name.trim() && url.trim()) {
      onAddLink({ categoryId: addLinkCategoryId, name: name.trim(), url: url.trim(), color });
      setAddLinkCategoryId(null);
    }
  };

  const handleSaveEditLink = (data: AILinkFormData) => {
    if (editingLink) {
      onUpdateLink(editingLink.id, data);
      setEditingLink(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        ref={contentRef}
        className={cn(
          'max-w-4xl w-[90vw] max-h-[90vh] min-h-[70vh] flex flex-col overflow-hidden p-4',
          isDragging && 'select-none'
        )}
        style={
          isDragging
            ? undefined
            : { transform: `translate(calc(-50% + ${dragPosition.x}px), calc(-50% + ${dragPosition.y}px))` }
        }
      >
        <DialogHeader
          className="py-2 shrink-0 cursor-grab active:cursor-grabbing pr-8"
          onMouseDown={handleDragStart}
          style={{ userSelect: 'none' }}
        >
          <DialogTitle className="flex items-center gap-2 text-base pointer-events-none">
            <Link2 className="h-4 w-4" />
            AI 링크 관리
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1 -mx-1">
          <div className="space-y-2 pb-2">
            {/* 카테고리 추가 */}
            {!showAddCategory ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 h-7 text-xs"
                onClick={() => setShowAddCategory(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                카테고리 추가
              </Button>
            ) : (
              <div className="flex gap-1.5 items-center">
                <Input
                  placeholder="카테고리 이름"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  autoFocus
                  className="flex-1 h-7 text-sm"
                />
                <Button size="sm" className="h-7 w-7 p-0" onClick={handleAddCategory}>
                  <Save className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setShowAddCategory(false); setNewCategoryName(''); }}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}

            {/* 카테고리별 링크 목록 */}
            {categories.map((category) => {
              const categoryLinks = getLinksByCategory(category.id);
              const isEditingCat = editingCategoryId === category.id;
              const isAddingLink = addLinkCategoryId === category.id;

              return (
                <div key={category.id} className="border rounded-md p-2 space-y-1">
                  <div className="flex items-center justify-between gap-1.5">
                    {isEditingCat ? (
                      <div className="flex gap-1.5 flex-1">
                        <Input
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdateCategory()}
                          className="h-7 text-sm"
                        />
                        <Button size="sm" className="h-7 w-7 p-0" onClick={handleUpdateCategory}>
                          <Save className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setEditingCategoryId(null); setEditingCategoryName(''); }}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="font-semibold text-xs">{category.name}</span>
                        <div className="flex gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleAddLink(category.id)}
                            aria-label="링크 추가"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleStartEditCategory(category)}
                            aria-label="카테고리 수정"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => setDeleteTarget({ type: 'category', id: category.id, name: category.name })}
                            aria-label="카테고리 삭제"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* 링크 목록 */}
                  <ul className="space-y-0.5 pl-1.5">
                    {categoryLinks.map((link) =>
                      editingLink?.id === link.id ? (
                        <LinkEditForm
                          key={link.id}
                          link={editingLink}
                          categories={categories}
                          onSave={handleSaveEditLink}
                          onCancel={() => setEditingLink(null)}
                        />
                      ) : (
                        <li key={link.id} className="flex items-center justify-between gap-1.5 py-0.5 group min-h-[24px]">
                          <span className={cn('text-xs truncate flex-1 min-w-0', link.color)}>{link.name}</span>
                          <span className="text-[11px] text-muted-foreground truncate max-w-[100px]">{link.url}</span>
                          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => setEditingLink(link)}
                              aria-label="수정"
                            >
                              <Edit className="h-2.5 w-2.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-destructive"
                              onClick={() => setDeleteTarget({ type: 'link', id: link.id, name: link.name })}
                              aria-label="삭제"
                            >
                              <Trash2 className="h-2.5 w-2.5" />
                            </Button>
                          </div>
                        </li>
                      )
                    )}
                    {isAddingLink && (
                      <li>
                        <NewLinkForm
                          onSave={handleSaveNewLink}
                          onCancel={() => setAddLinkCategoryId(null)}
                        />
                      </li>
                    )}
                    {categoryLinks.length === 0 && !isAddingLink && (
                      <li className="text-xs text-muted-foreground py-0.5">링크 없음</li>
                    )}
                  </ul>
                </div>
              );
            })}

            {categories.length === 0 && (
              <p className="text-sm text-muted-foreground">카테고리를 먼저 추가하세요.</p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-1.5 border-t shrink-0">
          <p className="text-[11px] text-muted-foreground">
            {categories.length}개 카테고리 · {links.length}개 링크
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 h-7 text-xs text-muted-foreground"
            onClick={() => setShowResetConfirm(true)}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            기본값으로 초기화
          </Button>
        </div>
      </DialogContent>

      {/* 삭제 확인 */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteTarget?.type === 'category' ? '카테고리 삭제' : '링크 삭제'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === 'category' ? (
                <>"{deleteTarget.name}" 카테고리와 해당 링크를 모두 삭제합니다.</>
              ) : (
                <>"{deleteTarget?.name}" 링크를 삭제합니다.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget) {
                  if (deleteTarget.type === 'category') onDeleteCategory(deleteTarget.id);
                  else onDeleteLink(deleteTarget.id);
                  setDeleteTarget(null);
                }
              }}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 기본값 초기화 확인 */}
      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>기본값으로 초기화</AlertDialogTitle>
            <AlertDialogDescription>
              AI 링크와 카테고리를 기본 목록으로 초기화합니다. 현재 데이터는 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onReset();
                setShowResetConfirm(false);
              }}
            >
              초기화
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

function NewLinkForm({
  onSave,
  onCancel,
}: {
  onSave: (name: string, url: string, color?: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [color, setColor] = useState('');

  return (
    <div className="flex flex-col gap-1 py-1">
      <div className="flex gap-1.5 flex-wrap items-center">
        <Input
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-6 text-xs flex-1 min-w-[80px]"
        />
        <Input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="h-6 text-xs flex-1 min-w-[120px]"
        />
        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-6 rounded border border-input bg-background px-2 text-xs"
        >
          {COLOR_OPTIONS.map((opt) => (
            <option key={opt.value || 'default'} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <Button size="sm" className="h-6 px-2 text-xs" onClick={() => onSave(name, url, color || undefined)} disabled={!name.trim() || !url.trim()}>
          <Save className="h-3 w-3 mr-1" />
          추가
        </Button>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={onCancel}>
          <X className="h-3 w-3 mr-1" />
          취소
        </Button>
      </div>
    </div>
  );
}

function LinkEditForm({
  link,
  categories,
  onSave,
  onCancel,
}: {
  link: AILink;
  categories: AILinkCategory[];
  onSave: (data: AILinkFormData) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(link.name);
  const [url, setUrl] = useState(link.url);
  const [categoryId, setCategoryId] = useState(link.categoryId);
  const [color, setColor] = useState(link.color ?? '');

  return (
    <div className="flex flex-col gap-1 py-1">
      <div className="flex gap-1.5 flex-wrap items-center">
        <Input
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-6 text-xs flex-1 min-w-[80px]"
        />
        <Input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="h-6 text-xs flex-1 min-w-[120px]"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="h-6 rounded border border-input bg-background px-2 text-xs"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-6 rounded border border-input bg-background px-2 text-xs"
        >
          {COLOR_OPTIONS.map((opt) => (
            <option key={opt.value || 'default'} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <Button size="sm" className="h-6 px-2 text-xs" onClick={() => onSave({ categoryId, name: name.trim(), url: url.trim(), color: color || undefined })} disabled={!name.trim() || !url.trim()}>
          <Save className="h-3 w-3 mr-1" />
          저장
        </Button>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={onCancel}>
          <X className="h-3 w-3 mr-1" />
          취소
        </Button>
      </div>
    </div>
  );
}
