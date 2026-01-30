import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LLMService {
  name: string;
  url: string;
  color: string;
  bgColor: string;
}

const llmServices: LLMService[] = [
  {
    name: 'Gemini',
    url: 'https://gemini.google.com',
    color: 'text-blue-600',
    bgColor: 'hover:bg-blue-50',
  },
  {
    name: 'NotebookLM',
    url: 'https://notebooklm.google.com',
    color: 'text-green-600',
    bgColor: 'hover:bg-green-50',
  },
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    color: 'text-emerald-600',
    bgColor: 'hover:bg-emerald-50',
  },
  {
    name: 'Claude',
    url: 'https://claude.ai',
    color: 'text-orange-600',
    bgColor: 'hover:bg-orange-50',
  },
  {
    name: 'Grok',
    url: 'https://x.com/i/grok',
    color: 'text-gray-800',
    bgColor: 'hover:bg-gray-100',
  },
];

export function LLMLinks() {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {llmServices.map((service) => (
          <Tooltip key={service.name}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 text-xs font-medium ${service.bgColor} ${service.color}`}
                onClick={() => window.open(service.url, '_blank', 'noopener,noreferrer')}
              >
                {service.name}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{service.name} 열기</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
