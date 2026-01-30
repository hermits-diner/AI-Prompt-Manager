import { useState, useCallback, useRef } from 'react';
import type { PromptFormData } from '@/types/prompt';
import { parseBulkImport, parseJsonImport, parseCsvImport } from '@/lib/parseBulkPrompts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Upload, FileText, ClipboardPaste, X, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface BulkImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (dataList: PromptFormData[]) => void;
}

const ACCEPT = '.json,.csv';
const PREVIEW_ROWS = 5;

const SAMPLE_JSON_STRING = `[
  {"title":"개념 설명 요청","content":"다음 개념을 고등학생 수준으로 쉽게 설명해 주세요.\\n[개념명 입력]","category":"수업·강의","tags":["개념설명","수업"]},
  {"title":"서술형 문항 출제","content":"다음 단원에 맞는 서술형 2문항을 출제하고 채점 포인트를 적어 주세요.\\n[단원명 입력]","category":"평가·채점","tags":["서술형","출제"]}
]`;

const SAMPLE_CSV_STRING = `title,content,category,tags
개념 설명 요청,"다음 개념을 고등학생 수준으로 쉽게 설명해 주세요.",수업·강의,"개념설명|수업"
서술형 문항 출제,"다음 단원에 맞는 서술형 2문항을 출제해 주세요.",평가·채점,"서술형|출제"`;

export function BulkImportDialog({
  isOpen,
  onClose,
  onImport,
}: BulkImportDialogProps) {
  const [activeTab, setActiveTab] = useState<'file' | 'paste'>('file');
  const [pasteText, setPasteText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parsedFromPaste = pasteText.trim()
    ? parseBulkImport(pasteText)
    : [];

  const parseFileContent = useCallback(
    (text: string, fileName: string): PromptFormData[] => {
      const lower = fileName.toLowerCase();
      if (lower.endsWith('.json')) return parseJsonImport(text);
      if (lower.endsWith('.csv')) return parseCsvImport(text);
      return parseBulkImport(text);
    },
    []
  );

  const [fileParsed, setFileParsed] = useState<PromptFormData[]>([]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      setFileError(null);
      if (!f) {
        setFile(null);
        setFileParsed([]);
        return;
      }
      const lower = f.name.toLowerCase();
      if (!lower.endsWith('.json') && !lower.endsWith('.csv')) {
        setFileError('JSON 또는 CSV 파일만 업로드할 수 있습니다.');
        setFile(null);
        setFileParsed([]);
        return;
      }
      setFile(f);
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = String(reader.result ?? '');
          const parsed = parseFileContent(text, f.name);
          setFileParsed(parsed);
          if (parsed.length === 0) {
            setFileError('유효한 프롬프트를 찾을 수 없습니다. 형식을 확인해 주세요.');
          }
        } catch {
          setFileError('파일을 읽는 중 오류가 발생했습니다.');
          setFileParsed([]);
        }
      };
      reader.readAsText(f, 'UTF-8');
    },
    [parseFileContent]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files?.[0];
      if (!f) return;
      const lower = f.name.toLowerCase();
      if (!lower.endsWith('.json') && !lower.endsWith('.csv')) {
        setFileError('JSON 또는 CSV 파일만 업로드할 수 있습니다.');
        return;
      }
      setFileError(null);
      setFile(f);
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = String(reader.result ?? '');
          const parsed = parseFileContent(text, f.name);
          setFileParsed(parsed);
          if (parsed.length === 0) {
            setFileError('유효한 프롬프트를 찾을 수 없습니다.');
          }
        } catch {
          setFileError('파일을 읽는 중 오류가 발생했습니다.');
          setFileParsed([]);
        }
      };
      reader.readAsText(f, 'UTF-8');
    },
    [parseFileContent]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setFileParsed([]);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const validList =
    activeTab === 'file' ? fileParsed : parsedFromPaste;
  const canImport = validList.length > 0;

  const handleImport = useCallback(() => {
    if (!canImport) return;
    onImport(validList);
    onClose();
    setPasteText('');
    clearFile();
    setActiveTab('file');
  }, [canImport, validList, onImport, onClose, clearFile]);

  const handleClose = useCallback(() => {
    onClose();
    setPasteText('');
    clearFile();
    setFileError(null);
    setActiveTab('file');
  }, [onClose, clearFile]);

  const copySampleJson = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(SAMPLE_JSON_STRING);
      toast.success('샘플 JSON이 클립보드에 복사되었습니다');
    } catch {
      toast.error('복사에 실패했습니다');
    }
  }, []);

  const copySampleCsv = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(SAMPLE_CSV_STRING);
      toast.success('샘플 CSV가 클립보드에 복사되었습니다');
    } catch {
      toast.error('복사에 실패했습니다');
    }
  }, []);

  const previewList = validList.slice(0, PREVIEW_ROWS);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>프롬프트 일괄 가져오기</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 flex-wrap text-sm">
          <span className="text-muted-foreground">샘플을 클립보드에 복사:</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            onClick={copySampleJson}
          >
            <Copy className="h-3.5 w-3.5" />
            샘플 JSON
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            onClick={copySampleCsv}
          >
            <Copy className="h-3.5 w-3.5" />
            샘플 CSV
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'file' | 'paste')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file" className="gap-2">
              <FileText className="h-4 w-4" />
              파일 업로드
            </TabsTrigger>
            <TabsTrigger value="paste" className="gap-2">
              <ClipboardPaste className="h-4 w-4" />
              붙여넣기
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-3 mt-3">
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT}
              className="hidden"
              onChange={handleFileChange}
            />
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
              }`}
            >
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={clearFile}
                    aria-label="파일 선택 해제"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    JSON 또는 CSV 파일을 드래그하거나 선택하세요
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    파일 선택
                  </Button>
                </>
              )}
            </div>
            {fileError && (
              <p className="text-sm text-destructive">{fileError}</p>
            )}
          </TabsContent>

          <TabsContent value="paste" className="space-y-3 mt-3">
            <Textarea
              placeholder={`JSON 예시:\n[{"title":"제목","content":"내용","category":"미분류","tags":[]}]\n\nCSV 예시:\ntitle,content,category,tags\n제목,내용,카테고리,"태그1|태그2"`}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              className="min-h-[180px] font-mono text-sm resize-none"
            />
            {pasteText.trim() && parsedFromPaste.length === 0 && (
              <p className="text-sm text-destructive">
                유효한 프롬프트를 찾을 수 없습니다. JSON 또는 CSV 형식을 확인해 주세요.
              </p>
            )}
          </TabsContent>
        </Tabs>

        {validList.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              미리보기 (총 {validList.length}건, 상위 {PREVIEW_ROWS}건)
            </p>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>제목</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead className="w-20">태그</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewList.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{row.title}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.tags.length}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button
            type="button"
            disabled={!canImport}
            onClick={handleImport}
          >
            <Upload className="h-4 w-4 mr-2" />
            {validList.length}건 가져오기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
