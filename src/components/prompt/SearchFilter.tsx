import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Category } from '@/types/category';

interface SearchFilterProps {
  categories: Category[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  showFavoritesOnly: boolean;
  onFavoritesChange: (show: boolean) => void;
  sortBy: 'newest' | 'oldest' | 'name';
  onSortChange: (sort: 'newest' | 'oldest' | 'name') => void;
}

export function SearchFilter({
  categories,
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  showFavoritesOnly,
  onFavoritesChange,
  sortBy,
  onSortChange,
}: SearchFilterProps) {
  const toggleCategory = (categoryName: string) => {
    if (selectedCategories.includes(categoryName)) {
      onCategoryChange(selectedCategories.filter(c => c !== categoryName));
    } else {
      onCategoryChange([...selectedCategories, categoryName]);
    }
  };

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange([]);
    onFavoritesChange(false);
    onSortChange('newest');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    showFavoritesOnly ||
    sortBy !== 'newest';

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="프롬프트 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 transition-shadow duration-200 focus:shadow-md"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => onSearchChange('')}
              aria-label="검색어 지우기"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              필터
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  !
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>정렬</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={sortBy === 'newest'}
              onCheckedChange={() => onSortChange('newest')}
            >
              최신순
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={sortBy === 'oldest'}
              onCheckedChange={() => onSortChange('oldest')}
            >
              오래된순
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={sortBy === 'name'}
              onCheckedChange={() => onSortChange('name')}
            >
              이름순
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>필터</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={showFavoritesOnly}
              onCheckedChange={onFavoritesChange}
            >
              즐겨찾기만
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>카테고리</DropdownMenuLabel>
            {categories.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                등록된 카테고리가 없습니다
              </div>
            ) : (
              categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category.id}
                  checked={selectedCategories.includes(category.name)}
                  onCheckedChange={() => toggleCategory(category.name)}
                >
                  {category.name}
                </DropdownMenuCheckboxItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          {showFavoritesOnly && (
            <Badge variant="secondary" className="gap-1">
              즐겨찾기
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFavoritesChange(false)}
              />
            </Badge>
          )}
          {selectedCategories.map((category) => (
            <Badge key={category} variant="secondary" className="gap-1">
              {category}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleCategory(category)}
              />
            </Badge>
          ))}
          {sortBy !== 'newest' && (
            <Badge variant="secondary" className="gap-1">
              {sortBy === 'oldest' ? '오래된순' : '이름순'}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onSortChange('newest')}
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={clearFilters}
          >
            모두 지우기
          </Button>
        </div>
      )}
    </div>
  );
}
