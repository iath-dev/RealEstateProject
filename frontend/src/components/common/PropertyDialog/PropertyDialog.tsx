import { useMemo } from 'react';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Trash2 } from 'lucide-react';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import usePropertyDetails from '@/hooks/usePropertyDetails';
import { usePropertyStore } from '@/store';

import PropertyDialogContent from './PropertyDialogContent';
import PropertyDialogTitle from './PropertyDialogTitle';
import PropertyImagesCarousel from './PropertyImagesCarousel';
import PropertyOwnerCard from './PropertyOwnerCard';
import PropertyTraces from './PropertyTraces';

export default function PropertyDialog() {
  const { selectedPropertyId, closeDialog } = usePropertyStore();

  const open = useMemo(() => selectedPropertyId !== null, [selectedPropertyId]);

  const { error, isError, data: property } = usePropertyDetails();

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <VisuallyHidden>
        <DialogTitle>Property {property?.idProperty} Details</DialogTitle>
      </VisuallyHidden>
      <DialogContent>
        {isError && (
          <Alert>
            <AlertTitle>
              <Trash2 />
              {error.message}
            </AlertTitle>
          </Alert>
        )}
        <ScrollArea className="space-y-6 max-h-[80vh] pr-2">
          <DialogHeader>
            <PropertyImagesCarousel />
            <PropertyDialogTitle />
          </DialogHeader>
          <PropertyDialogContent />
          <div className="my-3.5">
            <PropertyOwnerCard />
          </div>
          <PropertyTraces />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
