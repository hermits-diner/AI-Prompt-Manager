import { useState, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, Eraser } from 'lucide-react';
import { toast } from 'sonner';

const STORAGE_KEY = 'ai-prompt-manager-scratchpad';

function loadSaved(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

export function ScratchpadWidget() {
  const [value, setValue] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setValue(loadSaved());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore quota / private mode
    }
  }, [value, isHydrated]);

  const handleCopy = useCallback(async () => {
    if (!value.trim()) {
      toast.info('복사할 내용이 없습니다');
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      toast.success('메모가 복사되었습니다');
    } catch {
      toast.error('복사에 실패했습니다');
    }
  }, [value]);

  const handleClear = useCallback(() => {
    setValue('');
    toast.success('메모를 비웠습니다');
  }, []);

  return (
    <div className="shrink-0 flex flex-col border-t border-amber-200/80 dark:border-amber-800/50 bg-amber-50/70 dark:bg-amber-950/40 transition-shadow duration-300 focus-within:shadow-[0_-4px_12px_rgba(251,191,36,0.15)] dark:focus-within:shadow-[0_-4px_12px_rgba(180,83,9,0.2)]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-amber-200/60 dark:border-amber-800/40 bg-amber-100/40 dark:bg-amber-900/20">
        <span className="text-sm font-semibold text-amber-900/90 dark:text-amber-100/90 tracking-tight flex items-center gap-2">
          <span className="flex h-1.5 w-1 rounded-full bg-amber-500/80" aria-hidden />
          빠른 메모
        </span>
        <div className="flex gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-amber-200/50 dark:hover:bg-amber-800/40 hover:text-amber-800 dark:hover:text-amber-200"
            onClick={handleCopy}
            aria-label="메모 복사"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-amber-200/50 dark:hover:bg-amber-800/40 hover:text-amber-800 dark:hover:text-amber-200"
            onClick={handleClear}
            aria-label="메모 비우기"
          >
            <Eraser className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <Textarea
        placeholder="AI에 붙여넣기 전 여기서 문장만 수정하세요..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="min-h-[180px] max-h-[260px] resize-none rounded-none border-0 bg-amber-50/50 dark:bg-amber-950/30 text-xs placeholder:text-amber-600/60 dark:placeholder:text-amber-400/50 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-2 transition-colors duration-200"
        rows={6}
      />
    </div>
  );
}
