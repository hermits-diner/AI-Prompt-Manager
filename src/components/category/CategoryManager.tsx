import { useState } from 'react';
import type { Category, CategoryFormData } from '@/types/category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Folder,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface CategoryManagerProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: CategoryFormData) => void;
  onUpdate: (id: string, data: CategoryFormData) => void;
  onDelete: (id: string) => void;
  onReset: () => void;
  getPromptCountByCategory: (categoryName: string) => number;
}

export function CategoryManager({
  categories,
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  onDelete,
  onReset,
  getPromptCountByCategory,
}: CategoryManagerProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleAdd = () => {
    if (newCategoryName.trim()) {
      onAdd({ name: newCategoryName.trim() });
      setNewCategoryName('');
      setShowAddForm(false);
    }
  };

  const handleUpdate = () => {
    if (editingCategory && editingCategory.name.trim()) {
      onUpdate(editingCategory.id, { name: editingCategory.name.trim() });
      setEditingCategory(null);
    }
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirmId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showAddForm) {
        handleAdd();
      } else if (editingCategory) {
        handleUpdate();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            카테고리 관리
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add New Category */}
          {!showAddForm ? (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="h-4 w-4" />
              새 카테고리 추가
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="카테고리 이름"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <Button onClick={handleAdd} size="sm" aria-label="저장">
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAddForm(false);
                  setNewCategoryName('');
                }}
                aria-label="취소"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Categories List */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>카테고리명</TableHead>
                  <TableHead className="w-24 text-center">프롬프트</TableHead>
                  <TableHead className="w-24 text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      등록된 카테고리가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        {editingCategory?.id === category.id ? (
                          <Input
                            value={editingCategory.name}
                            onChange={(e) =>
                              setEditingCategory({
                                ...editingCategory,
                                name: e.target.value,
                              })
                            }
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="h-8"
                          />
                        ) : (
                          <span className="font-medium">{category.name}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center bg-muted rounded-full px-2 py-0.5 text-sm min-w-[24px]">
                          {getPromptCountByCategory(category.name)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {editingCategory?.id === category.id ? (
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={handleUpdate}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setEditingCategory(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setEditingCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => setDeleteConfirmId(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Reset to Defaults */}
          <div className="flex justify-between items-center pt-2">
            <p className="text-sm text-muted-foreground">
              총 {categories.length}개의 카테고리
            </p>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-muted-foreground"
              onClick={() => setShowResetConfirm(true)}
              aria-label="기본 카테고리로 초기화"
            >
              <RotateCcw className="h-4 w-4" />
              기본값으로 초기화
            </Button>
          </div>
        </div>

        {/* Reset Confirmation Dialog */}
        <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>기본 카테고리로 초기화</AlertDialogTitle>
              <AlertDialogDescription>
                기본 카테고리로 초기화하시겠습니까? 현재 카테고리는 모두 삭제됩니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onReset();
                  setShowResetConfirm(false);
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                초기화
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Confirmation Dialog */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-destructive/10 p-2 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold">카테고리 삭제</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                &quot;{categories.find(c => c.id === deleteConfirmId)?.name}&quot; 카테고리를 삭제하시겠습니까?
                <br />
                <span className="text-destructive">
                  이 카테고리에 속한 프롬프트는 &quot;미분류&quot;로 변경됩니다.
                </span>
              </p>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirmId(null)}
                >
                  취소
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(deleteConfirmId)}
                >
                  삭제
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
