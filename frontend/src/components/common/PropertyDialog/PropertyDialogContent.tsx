import React from 'react';

import { MapPin } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import usePropertyDetails from '@/hooks/usePropertyDetails';
import { formatPrice } from '@/utils/format';

const PropertyDialogContent: React.FC = () => {
  const { data: property, isLoading, isError } = usePropertyDetails();

  if (isLoading) return <Skeleton className="w-full rounded-lg h-18" />;

  if (!property || isError) return null;

  return (
    <div className="my-4 p-2 flex flex-col gap-4 starting:opacity-0 opacity-100 transition-all">
      <div className="flex gap-4 items-center">
        <MapPin size={20} />
        <p className="text-gray-700 font-medium leading-relaxed">{property.address}</p>
      </div>
      <p className="text-3xl font-bold text-end text-emerald-500">{formatPrice(property.price)}</p>
    </div>
  );
};

export default PropertyDialogContent;
