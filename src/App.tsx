import { useState, useMemo } from 'react';
import { usePrompts } from '@/hooks/usePrompts';
import { useCategories } from '@/hooks/useCategories';
import type { Prompt, PromptFormData } from '@/types/prompt';
import { PromptCard } from '@/components/prompt/PromptCard';
import { FavoritePromptRow } from '@/components/prompt/FavoritePromptRow';
import { PromptForm } from '@/components/prompt/PromptForm';
import { BulkImportDialog } from '@/components/prompt/BulkImportDialog';
import { SearchFilter } from '@/components/prompt/SearchFilter';
import { CategoryManager } from '@/components/category/CategoryManager';
import { AILinkSidebar } from '@/components/browser/AILinkSidebar';
import { AILinkManager } from '@/components/browser/AILinkManager';
import { ScratchpadWidget } from '@/components/browser/ScratchpadWidget';
import { useAILinks } from '@/hooks/useAILinks';
import { useBackgroundTheme } from '@/hooks/useBackgroundTheme';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { Plus, Sparkles, FolderOpen, FolderCog, Upload, Download, Link2, Star, Palette, Sun, Moon, Monitor } from 'lucide-react';
import { Toaster, toast } from 'sonner';

function App() {
  const {
    prompts,
    isLoaded: promptsLoaded,
    addPrompt,
    addPrompts,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    duplicatePrompt,
  } = usePrompts();

  const {
    categories,
    isLoaded: categoriesLoaded,
    addCategory,
    updateCategory,
    deleteCategory,
    resetToDefaults,
  } = useCategories();

  const {
    categories: aiLinkCategories,
    links: aiLinks,
    isLoaded: aiLinksLoaded,
    addCategory: addAILinkCategory,
    updateCategory: updateAILinkCategory,
    deleteCategory: deleteAILinkCategory,
    addLink: addAILink,
    updateLink: updateAILink,
    deleteLink: deleteAILink,
    resetToDefaults: resetAILinksToDefaults,
    getLinksByCategory,
  } = useAILinks();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isAILinkManagerOpen, setIsAILinkManagerOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  const { theme: backgroundTheme, setTheme: setBackgroundTheme, themeLabels } = useBackgroundTheme();
  const { theme: colorTheme, setTheme: setColorTheme, resolvedTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  const filteredPrompts = useMemo(() => {
    let result = [...prompts];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.content.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }
    if (showFavoritesOnly) {
      result = result.filter((p) => p.favorite);
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'oldest':
          return a.createdAt - b.createdAt;
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    return result;
  }, [prompts, searchQuery, selectedCategories, showFavoritesOnly, sortBy]);

  const favoritePrompts = useMemo(
    () => prompts.filter((p) => p.favorite).sort((a, b) => b.updatedAt - a.updatedAt),
    [prompts]
  );

  const handleAdd = () => {
    setEditingPrompt(null);
    setIsFormOpen(true);
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsFormOpen(true);
  };

  const handleSubmit = (data: PromptFormData) => {
    if (editingPrompt) {
      updatePrompt(editingPrompt.id, data);
      toast.success('프롬프트가 수정되었습니다');
    } else {
      addPrompt(data);
      toast.success('프롬프트가 추가되었습니다');
    }
  };

  const handleDelete = (id: string) => {
    deletePrompt(id);
    toast.success('프롬프트가 삭제되었습니다');
  };

  const handleDuplicate = (id: string) => {
    duplicatePrompt(id);
    toast.success('프롬프트가 복제되었습니다');
  };

  const handleBulkImport = (dataList: PromptFormData[]) => {
    const count = addPrompts(dataList);
    toast.success(`${count}개의 프롬프트를 가져왔습니다`);
  };

  const handleExport = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      prompts,
      categories,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-manager-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('데이터를 내보냈습니다.');
  };

  const getPromptCountByCategory = (categoryName: string) => {
    return prompts.filter((p) => p.category === categoryName).length;
  };

  const handleDeleteCategory = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      const promptsUsingCategory = prompts.filter((p) => p.category === category.name);
      promptsUsingCategory.forEach((p) => {
        updatePrompt(p.id, { ...p, category: '미분류' });
      });
      deleteCategory(id);
      toast.success(`"${category.name}" 카테고리가 삭제되었습니다`);
      if (selectedCategories.includes(category.name)) {
        setSelectedCategories((prev) => prev.filter((c) => c !== category.name));
      }
    }
  };

  const handleOpenAiUrl = (url: string, name: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success(`${name}을(를) 새 탭에서 열었습니다. 복사한 프롬프트는 Ctrl+V로 붙여넣기 하세요.`);
  };

  if (!promptsLoaded || !categoriesLoaded || !aiLinksLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Toaster position="top-center" richColors />

      <ResizablePanelGroup
        orientation="horizontal"
        className="flex-1"
        defaultLayout={{ left: 75, center: 25 }}
      >
        {/* Left: 프롬프트 (75%) */}
        <ResizablePanel
          id="left"
          defaultSize={75}
          minSize={40}
          maxSize={90}
          className="flex flex-col min-h-0 overflow-hidden"
          style={{ minWidth: 280 }}
        >
          <header className="border-b bg-card shrink-0 px-3 py-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-primary/10 p-1.5 rounded-lg shrink-0 transition-transform duration-300 hover:scale-110 hover:rotate-6">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold truncate">AI 프롬프트 매니저</h1>
                <p className="text-xs text-muted-foreground">
                  {prompts.length}개 프롬프트 · {categories.length}개 카테고리
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Button variant="outline" size="sm" className="h-8 gap-1 px-2 transition-all duration-200 hover:scale-105 active:scale-95" onClick={handleAdd} aria-label="새 프롬프트">
                <Plus className="h-3.5 w-3.5" />
                <span className="text-xs">새로 추가</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1 px-2 transition-all duration-200 hover:scale-105 active:scale-95" onClick={() => setIsBulkImportOpen(true)} aria-label="일괄 가져오기">
                <Upload className="h-3.5 w-3.5" />
                <span className="text-xs">가져오기</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1 px-2 transition-all duration-200 hover:scale-105 active:scale-95" onClick={handleExport} aria-label="내보내기">
                <Download className="h-3.5 w-3.5" />
                <span className="text-xs">내보내기</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1 px-2 transition-all duration-200 hover:scale-105 active:scale-95" onClick={() => setIsCategoryManagerOpen(true)} aria-label="카테고리">
                <FolderCog className="h-3.5 w-3.5" />
                <span className="text-xs">카테고리</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1 px-2 transition-all duration-200 hover:scale-105 active:scale-95" aria-label="배경색">
                    <Palette className="h-3.5 w-3.5" />
                    <span className="text-xs">배경</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[180px]">
                  <DropdownMenuRadioGroup value={backgroundTheme} onValueChange={(v) => setBackgroundTheme(v as typeof backgroundTheme)}>
                    {(['default', 'cream', 'green', 'sepia'] as const).map((key) => (
                      <DropdownMenuRadioItem key={key} value={key}>
                        {themeLabels[key]}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1 px-2 transition-all duration-200 hover:scale-105 active:scale-95" aria-label="라이트/다크 모드">
                    {resolvedTheme === 'dark' ? <Moon className="h-3.5 w-3.5" /> : resolvedTheme === 'light' ? <Sun className="h-3.5 w-3.5" /> : <Monitor className="h-3.5 w-3.5" />}
                    <span className="text-xs">테마</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[140px]">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">라이트 / 다크</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={colorTheme ?? 'system'} onValueChange={(v) => setColorTheme(v)}>
                    <DropdownMenuRadioItem value="light" className="gap-2">
                      <Sun className="h-3.5 w-3.5" />
                      라이트
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark" className="gap-2">
                      <Moon className="h-3.5 w-3.5" />
                      다크
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system" className="gap-2">
                      <Monitor className="h-3.5 w-3.5" />
                      시스템
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <ScrollArea className="flex-1 min-h-0 overflow-auto">
            <div className="p-3 space-y-4 pb-6">
              <section>
                <h2 className="text-sm font-semibold text-foreground/90 tracking-tight mb-2 px-1 flex items-center gap-2">
                  <span className="flex h-1.5 w-1 rounded-full bg-primary/60" aria-hidden />
                  프롬프트
                </h2>
                <SearchFilter
                  categories={categories}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedCategories={selectedCategories}
                  onCategoryChange={setSelectedCategories}
                  showFavoritesOnly={showFavoritesOnly}
                  onFavoritesChange={setShowFavoritesOnly}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              </section>

              {favoritePrompts.length > 0 && (
                <section className="animate-fade-in-up">
                  <h2 className="text-sm font-semibold text-foreground/90 tracking-tight mb-1.5 px-1 flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 shrink-0" />
                    프롬프트 즐겨찾기
                  </h2>
                  <div className="rounded-lg border border-border bg-muted/30 p-2 space-y-1">
                    {favoritePrompts.map((prompt, idx) => (
                      <div
                        key={prompt.id}
                        className="animate-fade-in-up opacity-0"
                        style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'forwards' }}
                      >
                        <FavoritePromptRow
                          prompt={prompt}
                        onCopy={async () => {
                          try {
                            await navigator.clipboard.writeText(prompt.content);
                            toast.success('복사되었습니다');
                          } catch {
                            toast.error('복사에 실패했습니다');
                          }
                        }}
                          onToggleFavorite={() => toggleFavorite(prompt.id)}
                          onOpenDetail={() => handleEdit(prompt)}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {filteredPrompts.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {filteredPrompts.map((prompt, index) => (
                    <div
                      key={prompt.id}
                      className="animate-fade-in-up opacity-0"
                      style={{ animationDelay: `${index * 45}ms`, animationFillMode: 'forwards' }}
                    >
                      <PromptCard
                        prompt={prompt}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleFavorite={toggleFavorite}
                        onDuplicate={handleDuplicate}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
                  <div className="bg-muted/50 p-4 rounded-full mb-3 transition-transform duration-300 hover:scale-110">
                    <FolderOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">
                    {prompts.length === 0 ? '프롬프트가 없습니다' : '검색 결과가 없습니다'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                    {prompts.length === 0 ? '새로 추가해 보세요.' : '다른 검색어나 필터를 시도해 보세요.'}
                  </p>
                  {prompts.length === 0 && (
                    <Button onClick={handleAdd} size="sm" className="mt-3 gap-1 transition-all duration-200 hover:scale-105 active:scale-95">
                      <Plus className="h-3.5 w-3.5" />
                      새 프롬프트
                    </Button>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </ResizablePanel>

        <ResizableHandle withHandle className="shrink-0" />

        {/* Right: AI 링크 (25%, 클릭 시 새 탭에서 열림) */}
        <ResizablePanel
          id="center"
          defaultSize={25}
          minSize={10}
          maxSize={60}
          className="flex flex-col min-h-0 overflow-hidden border-l border-border"
          style={{ minWidth: 240 }}
        >
          <div className="border-b border-border px-3 py-2 shrink-0 flex items-center justify-between bg-muted/30">
            <span className="text-sm font-semibold text-foreground/90 tracking-tight flex items-center gap-2">
              <span className="flex h-1.5 w-1 rounded-full bg-primary/60" aria-hidden />
              AI 링크
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs transition-all duration-200 hover:scale-105 active:scale-95"
              onClick={() => setIsAILinkManagerOpen(true)}
              aria-label="AI 링크 관리"
            >
              <Link2 className="h-3.5 w-3.5" />
              관리
            </Button>
          </div>
          <ScrollArea className="flex-1 min-h-0 overflow-auto">
            <div className="p-4 pb-6">
              <AILinkSidebar
                categories={aiLinkCategories}
                getLinksByCategory={getLinksByCategory}
                onOpenUrl={handleOpenAiUrl}
              />
            </div>
          </ScrollArea>
          <ScratchpadWidget />
        </ResizablePanel>
      </ResizablePanelGroup>

      <BulkImportDialog
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImport={handleBulkImport}
      />

      <PromptForm
        prompt={editingPrompt}
        categories={categories}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        onManageCategories={() => {
          setIsFormOpen(false);
          setIsCategoryManagerOpen(true);
        }}
      />

      <CategoryManager
        categories={categories}
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        onAdd={addCategory}
        onUpdate={updateCategory}
        onDelete={handleDeleteCategory}
        onReset={() => {
          resetToDefaults();
          toast.success('기본 카테고리로 초기화되었습니다');
        }}
        getPromptCountByCategory={getPromptCountByCategory}
      />

      <AILinkManager
        categories={aiLinkCategories}
        links={aiLinks}
        isOpen={isAILinkManagerOpen}
        onClose={() => setIsAILinkManagerOpen(false)}
        onAddCategory={addAILinkCategory}
        onUpdateCategory={updateAILinkCategory}
        onDeleteCategory={deleteAILinkCategory}
        onAddLink={addAILink}
        onUpdateLink={updateAILink}
        onDeleteLink={deleteAILink}
        onReset={() => {
          resetAILinksToDefaults();
          toast.success('AI 링크를 기본값으로 초기화했습니다');
        }}
        getLinksByCategory={getLinksByCategory}
      />
    </div>
  );
}

export default App;
