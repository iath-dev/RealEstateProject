import { useEffect, useMemo, useRef } from 'react';

import { XIcon } from 'lucide-react';
import { useForm, Controller, type ControllerRenderProps } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PopoverTrigger, Popover, PopoverContent } from '@/components/ui/popover';
import { useBreakpoint } from '@/hooks/useMediaQuery';
import { usePropertyStore, type PropertyFiltersModel } from '@/store';

type FormValues = {
  name: string;
  address: string;
  minPrice: string;
  maxPrice: string;
};

const DEBOUNCE_MS = 700;

export function PropertyFilters() {
  const { setFilters } = usePropertyStore();

  const isDesktop = useBreakpoint('desktop');
  const { control, reset, watch, setValue } = useForm<FormValues>({
    defaultValues: { name: '', address: '', minPrice: '', maxPrice: '' },
  });

  const watched = watch();

  const [debouncedValues] = useDebounce(
    [watched.name, watched.address, watched.minPrice, watched.maxPrice],
    DEBOUNCE_MS
  );

  const filters = useMemo(() => {
    const [dName, dAddress, dMin, dMax] = debouncedValues ?? [];
    return {
      name: dName || undefined,
      address: dAddress || undefined,
      minPrice: dMin ? Number(dMin) : null,
      maxPrice: dMax ? Number(dMax) : null,
    } as PropertyFiltersModel;
  }, [debouncedValues]);

  const lastEmittedRef = useRef<string | null>(null);
  useEffect(() => {
    try {
      const json = JSON.stringify(filters || {});
      if (lastEmittedRef.current !== json) {
        lastEmittedRef.current = json;
        setFilters?.(filters);
      }
    } catch {
      setFilters?.(filters);
    }
  }, [filters, setFilters]);

  const changedFields = useMemo(() => {
    const list: { key: keyof FormValues; label: string; value: string }[] = [];
    if (watched.name) list.push({ key: 'name', label: 'Name', value: watched.name });
    if (watched.address) list.push({ key: 'address', label: 'Address', value: watched.address });
    if (watched.minPrice)
      list.push({ key: 'minPrice', label: 'Min Price', value: watched.minPrice });
    if (watched.maxPrice)
      list.push({ key: 'maxPrice', label: 'Max Price', value: watched.maxPrice });
    return list;
  }, [watched]);

  function clearAll() {
    reset({ name: '', address: '', minPrice: '', maxPrice: '' });
  }

  function clearField(key: keyof FormValues) {
    setValue(key, '');
  }

  return (
    <section className="w-full bg-base-100/50 p-4 rounded-md shadow-sm">
      <div className="flex w-full  md:items-end md:gap-4 gap-2 items-center">
        <Controller
          name="name"
          control={control}
          render={({ field }: { field: ControllerRenderProps<FormValues, 'name'> }) => (
            <Input {...field} placeholder="Name" className="w-full max-lg:w-full" />
          )}
        />

        <div className="contents max-lg:hidden">
          <Controller
            name="address"
            control={control}
            render={({ field }: { field: ControllerRenderProps<FormValues, 'address'> }) => (
              <Input {...field} placeholder="Address" className="w-full" />
            )}
          />

          <Controller
            name="minPrice"
            control={control}
            render={({ field }: { field: ControllerRenderProps<FormValues, 'minPrice'> }) => (
              <Input {...field} placeholder="Min Price" type="number" />
            )}
          />

          <Controller
            name="maxPrice"
            control={control}
            render={({ field }: { field: ControllerRenderProps<FormValues, 'maxPrice'> }) => (
              <Input {...field} placeholder="Max Price" type="number" />
            )}
          />
        </div>

        {!isDesktop && (
          <Popover>
            <PopoverTrigger asChild>
              <Button title="Show filters" type="button" popoverTarget="filter-options">
                <svg className="size-[1em]">
                  <use xlinkHref="/icons.svg#icon-filter" />
                </svg>
              </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-64" side="bottom" sideOffset={8}>
              <div className="flex flex-col gap-2">
                <Controller
                  name="address"
                  control={control}
                  render={({ field }: { field: ControllerRenderProps<FormValues, 'address'> }) => (
                    <Input {...field} placeholder="Address" className="w-full" />
                  )}
                />

                <Controller
                  name="minPrice"
                  control={control}
                  render={({ field }: { field: ControllerRenderProps<FormValues, 'minPrice'> }) => (
                    <Input {...field} placeholder="Min Price" type="number" className="w-full" />
                  )}
                />

                <Controller
                  name="maxPrice"
                  control={control}
                  render={({ field }: { field: ControllerRenderProps<FormValues, 'maxPrice'> }) => (
                    <Input {...field} placeholder="Max Price" type="number" className="w-full" />
                  )}
                />
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <div className="w-full mt-4 flex flex-wrap items-center gap-2">
        {changedFields.map((f) => (
          <Badge
            key={f.key}
            onClick={() => clearField(f.key)}
            role="button"
            variant="outline"
            aria-label={`Clear ${f.label}`}
            className="group cursor-pointer starting:opacity-0 starting:scale-95 scale-100 opacity-100 duration-500 transition-all ease-in-out"
            title={`Clear ${f.label}`}
          >
            <XIcon className="hidden group-hover:inline-block starting:opacity-0 opacity-100 duration-300 ease-in-out" />
            {f.label}: {f.value}
          </Badge>
        ))}

        {changedFields.length > 0 && (
          <Badge
            onClick={clearAll}
            role="button"
            className="cursor-pointer starting:opacity-0 opacity-100  starting:scale-95 scale-100 duration-500 transition-all ease-in-out"
            variant="destructive"
            title="Clear all filters"
          >
            Clear all
          </Badge>
        )}
      </div>
    </section>
  );
}

export default PropertyFilters;
