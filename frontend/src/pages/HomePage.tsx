import React, { useCallback, useRef } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader, Trash2Icon } from 'lucide-react';

import { getProperties } from '@/api/services';
import type { Property } from '@/api/types';
import PageHero from '@/components/common/PageHero';
import { PropertyCard } from '@/components/common/PropertyCard';
import PropertyDialog from '@/components/common/PropertyDialog';
import PropertyFilters from '@/components/common/PropertyFilters';
import MainLayout from '@/components/layout/MainLayout';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { usePropertyStore } from '@/store';

const HomePage: React.FC = () => {
  const { filters } = usePropertyStore();

  // TODO: Move logic to an custom hook to keep the component clean and focused on rendering.

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

  const observer = useRef<IntersectionObserver>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || isFetchingNextPage || isFetching) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching]
  );

  // TODO: Create the PropertyGrid component to encapsulate the grid layout and logic.
  return (
    <MainLayout>
      <PageHero
        title="Real Estate"
        description="Explore and invest in tokenized real estate properties using blockchain technology."
      >
        <PropertyFilters />
      </PageHero>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 mt-8">
        {isLoading && (
          <Alert className="col-span-full py-8">
            <Loader className="animate-spin" />
            <AlertTitle>Loading properties...</AlertTitle>
          </Alert>
        )}
        {isError && (
          <Alert variant="destructive" className="col-span-full py-8">
            <Trash2Icon />
            <AlertTitle>Error: {error?.message || "Couldn't load properties"}</AlertTitle>
          </Alert>
        )}
        {data?.pages.flatMap((page) =>
          page.items.map((property: Property) => (
            <PropertyCard key={property.idProperty} property={property} />
          ))
        )}
        {!isFetchingNextPage && hasNextPage && (
          <Skeleton ref={lastElementRef} className="w-full aspect-square rounded-lg"></Skeleton>
        )}
        {!hasNextPage && !isLoading && (
          <Alert variant="default" className="col-span-full text-center border-none">
            <AlertTitle>No more properties available at the moment</AlertTitle>
          </Alert>
        )}
      </div>
      <PropertyDialog />
    </MainLayout>
  );
};

export default HomePage;
