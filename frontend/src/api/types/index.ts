import type { PropertyFiltersModel } from '@/store';

export interface Owner {
  idOwner: number;
  name: string;
  address: string;
  photo: string;
  birthday: string; // ISO 8601 date string
}

export interface PropertyImage {
  idPropertyImage: number;
  file: string;
  enabled: boolean;
}

export interface PropertyTrace {
  idPropertyTrace: number;
  dateSale: string; // ISO 8601 date string
  name: string;
  value: number;
  tax: number;
}

export interface Property {
  idProperty: number;
  name: string;
  address: string;
  price: number;
  codeInternal: string;
  year: number;
  idOwner: number;
  ownerName: string;
  image?: string | null;
}

export interface PropertyDetail extends Omit<Property, 'idOwner' | 'ownerName' | 'image'> {
  owner: Owner;
  images: PropertyImage[];
  traces: PropertyTrace[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// --- API Request Payloads ---

export type CreateOwnerPayload = Omit<Owner, 'idOwner'>;
export type UpdateOwnerPayload = Partial<CreateOwnerPayload>;

export type CreatePropertyPayload = Omit<Property, 'idProperty' | 'ownerName' | 'image'>;
export type UpdatePropertyPayload = Partial<CreatePropertyPayload>;

export interface GetPropertiesRequest extends PropertyFiltersModel {
  page?: number;
  pageSize?: number;
}
