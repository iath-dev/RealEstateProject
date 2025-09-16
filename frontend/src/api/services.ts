import api from '@/api/index';
import type { Property, PagedResult } from '@/api/types';
import type { PropertyDetail } from '@/api/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProperties(params?: {
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}): Promise<PagedResult<Property>> {
  await delay(500);
  const res = await api.get('/properties', { params });
  return res.data as PagedResult<Property>;
}

export async function getPropertyDetail(id: number): Promise<PropertyDetail> {
  await delay(500);
  const res = await api.get(`/properties/${id}`);
  return res.data as PropertyDetail;
}
