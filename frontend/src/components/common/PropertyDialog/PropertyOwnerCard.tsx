import React from 'react';

import { MapPin, User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import usePropertyDetails from '@/hooks/usePropertyDetails';

const PropertyOwnerCard: React.FC = () => {
  const { data: property, isLoading, isError } = usePropertyDetails();

  if (isLoading) return <Skeleton className="w-full rounded-lg h-8" />;

  if (!property || isError) return null;

  const { owner } = property;

  return (
    <Card className="border-none shadow-none starting:opacity-0 opacity-100 transition-all">
      <CardHeader className="flex items-center gap-2">
        <CardAction>
          <User className="text-gray-600" size={20} />
        </CardAction>
        <CardTitle className="text-sm font-medium text-gray-700">Owner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar className="size-12">
            <AvatarImage className="object-cover" src={owner.photo} alt={owner.name} />
            <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-gray-900 mb-1">{owner.name}</div>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <MapPin size={12} />
              {owner.address}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyOwnerCard;
