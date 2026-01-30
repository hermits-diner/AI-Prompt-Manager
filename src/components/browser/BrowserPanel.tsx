import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BrowserPanelProps {
  url: string | null;
  className?: string;
}

const DEFAULT_PLACEHOLDER = '가운데 AI 링크를 클릭하면 새 탭에서 열립니다.';

export function BrowserPanel({ url, className }: BrowserPanelProps) {
  const openInNewTab = () => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={cn('h-full w-full bg-muted/30 flex flex-col', className)}>
      {url ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
          <div className="bg-muted/50 rounded-full p-6 mb-4">
            <ExternalLink className="h-12 w-12 text-primary/70" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">새 탭에서 열었습니다</p>
          <p className="text-xs text-muted-foreground mb-4 max-w-sm break-all">
            {url}
          </p>
          <p className="text-xs text-muted-foreground mb-4 max-w-xs">
            대부분의 AI 사이트(Gemini, ChatGPT 등)는 보안 정책으로 이 창에 표시할 수 없어<br />
            새 탭에서 열립니다. 복사한 프롬프트는 Ctrl+V로 붙여넣기 하세요.
          </p>
          <Button onClick={openInNewTab} className="gap-2" variant="outline">
            <ExternalLink className="h-4 w-4" />
            새 탭에서 다시 열기
          </Button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
          <div className="bg-muted/50 rounded-full p-6 mb-4">
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </div>
          <p className="text-sm font-medium">{DEFAULT_PLACEHOLDER}</p>
          <p className="text-xs mt-2 max-w-xs">
            프롬프트를 복사한 뒤 가운데에서 AI 서비스를 선택하면<br />
            새 탭에서 열립니다. (Ctrl+V로 붙여넣기)
          </p>
        </div>
      )}
    </div>
  );
}
