import { useState } from 'react';
import type { Prompt } from '@/types/prompt';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Star,
  MoreVertical,
  Copy,
  Edit,
  Trash2,
  Files,
  Check,
  X
} from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function PromptCard({
  prompt,
  onEdit,
  onDelete,
  onToggleFavorite,
  onDuplicate,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('복사에 실패했습니다.');
    }
  };

  const handleDelete = () => {
    onDelete(prompt.id);
    setShowDeleteConfirm(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Card className="group hover:-translate-y-0.5 hover:shadow-xl hover:border-primary/40 active:scale-[0.99] transition-all duration-300 ease-out cursor-pointer border-border/50 hover:border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0" onClick={() => setShowDetail(true)}>
              <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors duration-200">
                {prompt.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(prompt.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(prompt.id);
                }}
                aria-label={prompt.favorite ? '즐겨찾기 해제' : '즐겨찾기'}
              >
                <Star
                  className={`h-4 w-4 ${
                    prompt.favorite
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="더보기 메뉴">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(prompt)}>
                    <Edit className="h-4 w-4 mr-2" />
                    수정
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(prompt.id)}>
                    <Files className="h-4 w-4 mr-2" />
                    복제
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0" onClick={() => setShowDetail(true)}>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {prompt.content}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">
                {prompt.category}
              </Badge>
              {prompt.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {prompt.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{prompt.tags.length - 2}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={handleCopy}
              aria-label={copied ? '복사됨' : '내용 복사'}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">복사</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{prompt.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">{prompt.category}</Badge>
              {prompt.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">
                {prompt.content}
              </pre>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>생성: {formatDate(prompt.createdAt)}</span>
              <span>수정: {formatDate(prompt.updatedAt)}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    클립보드에 복사
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDetail(false);
                  onEdit(prompt);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                수정
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>프롬프트 삭제</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            &quot;{prompt.title}&quot; 프롬프트를 삭제하시겠습니까?
            <br />
            이 작업은 되돌릴 수 없습니다.
          </p>
          <div className="flex gap-2 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              <X className="h-4 w-4 mr-2" />
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              삭제
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
