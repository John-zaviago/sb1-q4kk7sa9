import { useState } from 'react';

interface UsePaginationProps {
  initialPageSize?: number;
  initialPageIndex?: number;
}

export function usePagination({
  initialPageSize = 10,
  initialPageIndex = 0,
}: UsePaginationProps = {}) {
  const [pageIndex, setPageIndex] = useState(initialPageIndex);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const paginateItems = <T>(items: T[]): T[] => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  };

  const pageCount = (totalItems: number) => Math.ceil(totalItems / pageSize);

  return {
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    paginateItems,
    pageCount,
  };
}