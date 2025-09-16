import React from 'react';

import { ChevronDown, History } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import usePropertyDetails from '@/hooks/usePropertyDetails';
import { formatDate, formatPrice } from '@/utils/format';

const PropertyTraces: React.FC = () => {
  const { data: property, isLoading, isError } = usePropertyDetails();

  if (isLoading) return <Skeleton className="w-full rounded-lg h-8" />;

  if (!property || isError) return null;

  const { traces } = property;

  return (
    <Collapsible className="space-y-3">
      <CollapsibleTrigger className="flex items-center gap-4 w-full group">
        <History className="text-gray-600" size={20} />
        <h1 className="font-semibold text-gray-900 flex-1 text-start">Trace History</h1>
        <ChevronDown className="transition-transform duration-300 group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="divide-y-2 divide-muted starting:h-0 transition-all">
        {traces.map((trace) => (
          <article
            key={trace.idPropertyTrace}
            className="group py-4 px-2 hover:bg-muted/50 first:rounded-t last:rounded-b flex justify-between items-center gap-2"
          >
            <div className="flex-1 flex flex-col gap-1">
              <h2 className="text-sm font-medium text-gray-900">{trace.name}</h2>
              <h3>
                <span className="text-xs text-gray-600">{formatDate(trace.dateSale)}</span>
              </h3>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <h1 className="font-semibold text-gray-900">{formatPrice(trace.value)}</h1>
              <Badge variant="secondary">{formatPrice(trace.tax)}</Badge>
            </div>
          </article>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PropertyTraces;
