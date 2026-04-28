import { useEffect, useMemo, useState } from "react";

export type UsePaginationArgs<T> = {
  items: readonly T[];
  pageSize?: number;
};

export type UsePaginationResult<T> = {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  pageItems: T[];
  pageSize: number;
  totalItems: number;
  rangeStart: number;
  rangeEnd: number;
  goPrev: () => void;
  goNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
};

export function usePagination<T>({
  items,
  pageSize = 10,
}: UsePaginationArgs<T>): UsePaginationResult<T> {
  const [page, setPageState] = useState(1);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPageState(totalPages);
    }
  }, [page, totalPages]);

  const setPage = (next: number) => {
    setPageState(Math.min(Math.max(1, next), totalPages));
  };

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  const goPrev = () => setPage(page - 1);
  const goNext = () => setPage(page + 1);

  return {
    page,
    setPage,
    totalPages,
    pageItems,
    pageSize,
    totalItems,
    rangeStart,
    rangeEnd,
    goPrev,
    goNext,
    hasPrev: page > 1,
    hasNext: page < totalPages,
  };
}
