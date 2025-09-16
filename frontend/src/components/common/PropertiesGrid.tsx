import React, { useCallback, useRef } from 'react';

import { Loader, Trash2Icon } from 'lucide-react';

import type { Property } from '@/api/types';
import { PropertyCard } from '@/components/common/PropertyCard';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useProperties } from '@/hooks/useProperties';
import { usePropertyStore } from '@/store';

const PropertiesGrid: React.FC = () => {
  const { filters } = usePropertyStore();

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
  } = useProperties({ filters });

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

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 mt-8">
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
      {isLoading ||
        isFetching ||
        (isFetchingNextPage && (
          <Alert className="col-span-full py-8">
            <Loader className="animate-spin" />
            <AlertTitle>Loading properties...</AlertTitle>
          </Alert>
        ))}
      {!hasNextPage && !isLoading && (
        <Alert variant="default" className="col-span-full text-center border-none">
          <AlertTitle>No more properties available at the moment</AlertTitle>
        </Alert>
      )}
    </div>
  );
};

export default PropertiesGrid;
