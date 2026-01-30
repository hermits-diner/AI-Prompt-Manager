import { Star, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Prompt } from '@/types/prompt';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FavoritePromptRowProps {
  prompt: Prompt;
  onCopy: () => void;
  onToggleFavorite: () => void;
  onOpenDetail: () => void;
}

export function FavoritePromptRow({
  prompt,
  onCopy,
  onToggleFavorite,
  onOpenDetail,
}: FavoritePromptRowProps) {
  return (
    <div className="flex items-center justify-between gap-1.5 py-1 pr-1.5 rounded-md hover:bg-muted/50 hover:translate-x-0.5 active:scale-[0.99] transition-all duration-200 ease-out cursor-pointer group">
      <div className="flex items-center gap-1.5 flex-1 min-w-0" onClick={onOpenDetail}>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-yellow-500 hover:bg-transparent"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          aria-label="즐겨찾기 해제"
        >
          <Star className="h-3.5 w-3.5 fill-yellow-400" />
        </Button>
        <span className="text-xs font-medium truncate flex-1 min-w-0">
          {prompt.title}
        </span>
      </div>
      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onCopy} aria-label="복사">
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>내용 복사</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onOpenDetail} aria-label="상세 보기">
          <ChevronRight className="h-3.5 w-3.5" />
        </Button> */}
      </div>
    </div>
  );
}
