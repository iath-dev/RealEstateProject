import { useEffect, useMemo, useRef } from 'react';

import { useForm, Controller, type ControllerRenderProps } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

export type PropertyFiltersModel = {
  name?: string;
  address?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
};

type Props = {
  onChange?: (filters: PropertyFiltersModel) => void;
  debounceMs?: number;
};

type FormValues = {
  name: string;
  address: string;
  minPrice: string;
  maxPrice: string;
};

export function PropertyFilters({ onChange, debounceMs = 400 }: Props) {
  const { control, reset, watch, setValue } = useForm<FormValues>({
    defaultValues: { name: '', address: '', minPrice: '', maxPrice: '' },
  });

  const watched = watch();

  const [debouncedValues] = useDebounce(
    [watched.name, watched.address, watched.minPrice, watched.maxPrice],
    debounceMs
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
        onChange?.(filters);
      }
    } catch {
      onChange?.(filters);
    }
  }, [filters, onChange]);

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
            <input
              {...field}
              placeholder="Name"
              className="input input-bordered w-full max-lg:w-full"
            />
          )}
        />

        <div className="contents max-lg:hidden">
          <Controller
            name="address"
            control={control}
            render={({ field }: { field: ControllerRenderProps<FormValues, 'address'> }) => (
              <input {...field} placeholder="Address" className="input input-bordered w-full" />
            )}
          />

          <Controller
            name="minPrice"
            control={control}
            render={({ field }: { field: ControllerRenderProps<FormValues, 'minPrice'> }) => (
              <input
                {...field}
                placeholder="Min Price"
                type="number"
                className="input input-bordered w-40"
              />
            )}
          />

          <Controller
            name="maxPrice"
            control={control}
            render={({ field }: { field: ControllerRenderProps<FormValues, 'maxPrice'> }) => (
              <input
                {...field}
                placeholder="Max Price"
                type="number"
                className="input input-bordered w-40"
              />
            )}
          />
        </div>

        <section className="lg:hidden">
          <button
            className="btn btn-square "
            title="Show filters"
            type="button"
            popoverTarget="filter-options"
          >
            <svg className="size-[1em]">
              <use xlinkHref="/icons.svg#icon-filter" />
            </svg>
          </button>

          <div
            id="filter-options"
            popover="auto"
            className="[position-area:bottom_left] w-full max-w-md p-4 bg-base-100 rounded-md shadow-lg backdrop:bg-black/20 backdrop:blur-sm"
            role="dialog"
          >
            <div className="flex flex-col gap-2">
              <Controller
                name="address"
                control={control}
                render={({ field }: { field: ControllerRenderProps<FormValues, 'address'> }) => (
                  <input {...field} placeholder="Address" className="input input-bordered w-full" />
                )}
              />

              <Controller
                name="minPrice"
                control={control}
                render={({ field }: { field: ControllerRenderProps<FormValues, 'minPrice'> }) => (
                  <input
                    {...field}
                    placeholder="Min Price"
                    type="number"
                    className="input input-bordered w-full"
                  />
                )}
              />

              <Controller
                name="maxPrice"
                control={control}
                render={({ field }: { field: ControllerRenderProps<FormValues, 'maxPrice'> }) => (
                  <input
                    {...field}
                    placeholder="Max Price"
                    type="number"
                    className="input input-bordered w-full"
                  />
                )}
              />
            </div>
          </div>
        </section>
      </div>

      <div className="w-full mt-4 flex flex-wrap items-center gap-2">
        {changedFields.map((f) => (
          <span
            key={f.key}
            onClick={() => clearField(f.key)}
            role="button"
            className="badge badge-secondary not-hover:badge-soft cursor-pointer group"
            title={`Clear ${f.label}`}
          >
            <span className="contents">
              {f.label}: {f.value}
            </span>
            <svg className="size-[1.2em] hidden group-hover:inline-block">
              <use xlinkHref="/icons.svg#icon-close" />
            </svg>
          </span>
        ))}

        {changedFields.length > 0 && (
          <span
            onClick={clearAll}
            role="button"
            className="badge badge-accent not-hover:badge-soft transition-colors duration-400 cursor-pointer"
            title="Clear all filters"
          >
            Clear all
          </span>
        )}
      </div>
    </section>
  );
}

export default PropertyFilters;
