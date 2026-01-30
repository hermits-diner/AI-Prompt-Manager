import { MessageSquare, Image as ImageIcon, Music, Wrench, Link2 } from 'lucide-react';
import type { AILinkCategory, AILink } from '@/types/aiLink';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const CATEGORY_ICON_MAP: Record<string, typeof MessageSquare> = {
  '채팅·작문': MessageSquare,
  '이미지': ImageIcon,
  '음악·음성': Music,
  '도구·기타': Wrench,
};

const CATEGORY_CARD_STYLES: Record<string, string> = {
  '채팅·작문':
    'bg-blue-50/80 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800',
  이미지:
    'bg-violet-50/80 border-violet-200 dark:bg-violet-950/40 dark:border-violet-800',
  '음악·음성':
    'bg-amber-50/80 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800',
  '도구·기타':
    'bg-slate-100/80 border-slate-200 dark:bg-slate-800/40 dark:border-slate-700',
};

function getCategoryIcon(name: string) {
  return CATEGORY_ICON_MAP[name] ?? Link2;
}

function getCategoryCardStyle(name: string) {
  return CATEGORY_CARD_STYLES[name] ?? 'bg-muted/20 border-border';
}

interface AILinkSidebarProps {
  categories: AILinkCategory[];
  getLinksByCategory: (categoryId: string) => AILink[];
  onOpenUrl: (url: string, name: string) => void;
  className?: string;
}

export function AILinkSidebar({
  categories,
  getLinksByCategory,
  onOpenUrl,
  className,
}: AILinkSidebarProps) {
  const sortedCategories = [...categories].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn('grid grid-cols-4 gap-3 w-full min-w-0', className)}>
        {sortedCategories.map((category) => {
          const Icon = getCategoryIcon(category.name);
          const linkList = getLinksByCategory(category.id);
          return (
            <section
              key={category.id}
              className={cn(
                'flex flex-col gap-1 w-full min-w-0 rounded-lg border p-2 transition-all duration-300 hover:shadow-md hover:scale-[1.02]',
                getCategoryCardStyle(category.name)
              )}
            >
              <div className="flex items-center gap-1.5 px-1 min-w-0">
                <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {category.name}
                </span>
              </div>
              <div className="flex flex-col gap-0 w-full min-w-0">
                {linkList.map((link) => (
                  <Tooltip key={link.id}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'w-full h-auto min-h-6 justify-start gap-1.5 px-1.5 py-0.5 text-xs font-medium rounded text-left whitespace-normal break-words overflow-visible leading-tight transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
                          link.color
                        )}
                        onClick={() => onOpenUrl(link.url, link.name)}
                      >
                        <span className="break-all">{link.name}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[200px]">
                      <p className="font-medium">{link.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                      <p className="text-xs mt-1">클릭 시 새 탭에서 열기</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                {linkList.length === 0 && (
                  <p className="text-[11px] text-muted-foreground px-1.5 py-0.5">링크 없음</p>
                )}
              </div>
            </section>
          );
        })}
        {categories.length === 0 && (
          <p className="text-xs text-muted-foreground px-2">카테고리를 추가하려면 &quot;AI 링크 관리&quot;를 클릭하세요.</p>
        )}
      </div>
    </TooltipProvider>
  );
}
