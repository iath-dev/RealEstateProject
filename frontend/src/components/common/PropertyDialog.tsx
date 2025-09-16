import { useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  ChevronDown,
  Hash,
  History,
  Image,
  Loader,
  MapPin,
  Trash2,
  User,
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

import { getPropertyDetail } from '@/api/services';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePropertyStore } from '@/store';
import { formatDate, formatPrice } from '@/utils/format';

// TODO: Break down this component into smaller sub-components to improve readability and maintainability.

export default function PropertyDialog() {
  const { selectedPropertyId, closeDialog } = usePropertyStore();

  const open = useMemo(() => selectedPropertyId !== null, [selectedPropertyId]);

  const {
    data: property,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['propertyDetail', selectedPropertyId],
    queryFn: () => getPropertyDetail(selectedPropertyId!),
    enabled: open && selectedPropertyId !== null,
  });

  const [currentImage, setCurrentImage] = useState(0);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent>
        {isLoading && (
          <Alert className="text-center py-8">
            <AlertTitle>
              <Loader className="animate-spin" />
              Loading...
            </AlertTitle>
          </Alert>
        )}
        {isError && (
          <Alert>
            <AlertTitle>
              <Trash2 />
              {error.message}
            </AlertTitle>
          </Alert>
        )}
        {property && (
          <ScrollArea className="space-y-6 max-h-[80vh] pr-2">
            <DialogHeader>
              <figure className="aspect-video w-full overflow-hidden rounded-lg relative">
                <ImageWithFallback
                  src={property.images[currentImage].file}
                  alt={`${property.name} image ${property.images[currentImage].idPropertyImage}`}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
                <figcaption className="absolute left-4 bottom-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Image size={14} />
                  {currentImage + 1} / {property.images.length}
                </figcaption>
              </figure>
              <div
                className={twMerge(
                  property.images.length > 1 && 'hidden',
                  'flex gap-2 mt-1 relative scroll-smooth snap-x snap-mandatory p-0.5',
                  '[&::-webkit-scrollbar]:hidden overflow-x-auto',
                  '[anchor-name:--images-carousel]',
                  '[&::scroll-button(*):disabled]:opacity-10 [&::scroll-button(*)]:transition-colors [&::scroll-button(*)]:duration-300 [&::scroll-button(*)]:bg-primary [&::scroll-button(*)]:text-white [&::scroll-button(*)]:font-medium  [&::scroll-button(*):focus]:ring-4  [&::scroll-button(*):focus]:ring-primary [&::scroll-button(*)]:text-center  [&::scroll-button(*)]:inline-flex [&::scroll-button(*)]:items-center [&::scroll-button(*)]:aspect-square [&::scroll-button(*)]:rounded-full [&::scroll-button(*)]:text-sm [&::scroll-button(*)]:absolute [&::scroll-button(*)]:[position-anchor:--images-carousel] [&::scroll-button(*)]:[align-self:anchor-center] [&::scroll-button(*)]:z-10 [&::scroll-button(*)]:cursor-pointer',
                  "[&::scroll-button(right)]:content-['>'] [&::scroll-button(right)]:[left:calc(anchor(right)-1em)]",
                  "[&::scroll-button(left)]:content-['<'] [&::scroll-button(left)]:[right:calc(anchor(left)-1em)]"
                )}
              >
                {property.images.map((img, index) => (
                  <ImageWithFallback
                    key={img.idPropertyImage}
                    src={img.file}
                    alt={`Image ${index + 1}`}
                    className={twMerge(
                      'h-20 flex-shrink-0 aspect-video object-cover rounded cursor-pointer snap-center opacity-90 hover:opacity-100 transition-all',
                      index === currentImage
                        ? 'opacity-100 ring-2 ring-blue-500 shadow-md'
                        : 'opacity-70 hover:opacity-90'
                    )}
                    onClick={() => setCurrentImage(index)}
                  />
                ))}
              </div>
              <div className="space-y-3">
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
            </DialogHeader>
            <div className="my-4 p-2 flex flex-col gap-4">
              <div className="flex gap-4 items-center">
                <MapPin size={20} />
                <p className="text-gray-700 font-medium leading-relaxed">{property.address}</p>
              </div>
              <p className="text-3xl font-bold text-end text-emerald-500">
                {formatPrice(property.price)}
              </p>
            </div>
            <div className="space-y-2 my-3.5">
              <Card className="border-none shadow-none">
                <CardHeader className="flex items-center gap-2">
                  <CardAction>
                    <User className="text-gray-600" size={20} />
                  </CardAction>
                  <CardTitle className="text-sm font-medium text-gray-700">Owner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="size-12">
                      <AvatarImage
                        className="object-cover"
                        src={property.owner.photo}
                        alt={property.owner.name}
                      />
                      <AvatarFallback>{property.owner.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">{property.owner.name}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin size={12} />
                        {property.owner.address}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {property.traces && property.traces.length > 0 && (
              <Collapsible className="space-y-3">
                <CollapsibleTrigger className="flex items-center gap-4 w-full group">
                  <History className="text-gray-600" size={20} />
                  <h1 className="font-semibold text-gray-900 flex-1 text-start">Trace History</h1>
                  <ChevronDown className="transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="divide-y-2 divide-muted starting:h-0 transition-all">
                  {property.traces.map((trace) => (
                    <article
                      key={trace.idPropertyTrace}
                      className="group py-4 px-2 hover:bg-muted/50 first:rounded-t last:rounded-b flex justify-between items-center gap-2"
                    >
                      <div className="flex-1 flex flex-col gap-1">
                        <h2 className="text-sm font-medium text-gray-900">{trace.name}</h2>
                        <h3>
                          <span className="text-xs text-gray-600">
                            {formatDate(trace.dateSale)}
                          </span>
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
            )}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
