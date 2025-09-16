import React from 'react';

import { Calendar, Hash } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import usePropertyDetails from '@/hooks/usePropertyDetails';

const PropertyDialogTitle: React.FC = () => {
  const { data: property, isLoading, isError } = usePropertyDetails();

  if (isLoading) return <Skeleton className="w-full rounded-lg h-12" />;

  if (!property || isError) return null;

  return (
    <div className="space-y-3 starting:opacity-0 opacity-100 transition-all">
      <DialogTitle className="text-3xl leading-tight">{property.name}</DialogTitle>
      <div className="flex flex-wrap gap-2">
        <Badge>
          <Hash /> {property.codeInternal}
        </Badge>
        <Badge variant="secondary">
          <Calendar /> {property.year}
        </Badge>
      </div>
    </div>
  );
};

export default PropertyDialogTitle;
