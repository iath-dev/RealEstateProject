import React, { useCallback, useRef, useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader, Trash2Icon } from 'lucide-react';

import { getProperties } from '@/api/services';
import type { Property } from '@/api/types';
import { PropertyCard } from '@/components/common/PropertyCard';
import PropertyDialog from '@/components/common/PropertyDialog';
import PropertyFilters, { type PropertyFiltersModel } from '@/components/common/PropertyFilters';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const HomePage: React.FC = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [filters, setFilters] = useState<PropertyFiltersModel>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  function cleanFilters(filters: PropertyFiltersModel): Record<string, string | number> {
    const cleaned: Record<string, string | number> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        cleaned[key] = value;
      }
    });
    return cleaned;
  }

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
    queryKey: ['properties', cleanFilters(filters)],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => getProperties({ ...cleanFilters(filters), page: pageParam }),
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

  function handleFiltersChange(newFilters: PropertyFiltersModel) {
    setFilters(newFilters);
  }

  function handleCardClick(property: Property) {
    setSelectedPropertyId(property.idProperty);
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setSelectedPropertyId(null);
  }
  return (
    <section className="min-h-screen bg-base-200 flex flex-col overflow-x-hidden">
      <main className="container mx-auto px-2 sm:px-6 lg:px-8 py-6 flex-grow w-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary">Real Estate</h1>
        <div className="mt-6">
          <p className="text-lg">
            Welcome to our platform where you can explore and invest in tokenized real estate
            properties using blockchain technology.
          </p>
        </div>
        <div className="mt-6">
          <PropertyFilters onChange={handleFiltersChange} debounceMs={700} />
        </div>
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
              <PropertyCard
                key={property.idProperty}
                property={property}
                onClick={handleCardClick}
              />
            ))
          )}
          {!isFetchingNextPage && hasNextPage && (
            <Skeleton ref={lastElementRef} className="w-full aspect-square rounded-lg"></Skeleton>
          )}
          {!hasNextPage && (
            <Alert variant="default" className="col-span-full text-center border-none">
              <AlertTitle>No more properties available at the moment</AlertTitle>
            </Alert>
          )}
        </div>
        {dialogOpen && selectedPropertyId && (
          <PropertyDialog
            propertyId={selectedPropertyId}
            open={dialogOpen}
            onClose={handleDialogClose}
          />
        )}
      </main>
    </section>
  );
};

export default HomePage;
