import { Eye, MapPin } from 'lucide-react';

import { type Property } from '@/api/types';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/utils/format';

interface PropertyCardProps {
  property: Property;
  onClick?: (p: Property) => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  return (
    <Card className="w-full overflow-hidden pt-0 hover:shadow-sm transition-all starting:opacity-0 opacity-100 duration-500 starting:scale-95 scale-100">
      <figure className="aspect-video w-full overflow-hidden">
        <ImageWithFallback
          src={property.image || 'https://placehold.co/600x400?text=No+Image'}
          alt="Beautiful property"
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </figure>
      <CardHeader>
        <CardTitle className="line-clamp-1">{property.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{property.address}</span>
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold text-primary">{formatPrice(property.price)}</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full cursor-pointer" role="button" onClick={() => onClick!(property)}>
          <Eye />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
