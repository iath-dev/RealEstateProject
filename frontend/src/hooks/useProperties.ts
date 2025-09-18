import { useInfiniteQuery } from '@tanstack/react-query';

import { getProperties } from '@/api/services';
import type { PropertyFiltersModel } from '@/store';

export interface UsePropertiesResult {
  filters: PropertyFiltersModel;
}

export const useProperties = ({ filters }: UsePropertiesResult) => {
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['properties', filters],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => getProperties({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasNextPage) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60, // 1 min
    gcTime: 1000 * 60 * 5, // 5 min
  });

  return {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
  };
};
