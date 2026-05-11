// ──────────────────────────────────────────────────────────
// 매거진 서비스 (API 연동 버전)
// ──────────────────────────────────────────────────────────

import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import type { MagazineItem } from './magazine-dto';

export const magazineService = {
  fetchList: () => apiGet<MagazineItem[]>('/api/magazines'),

  fetchById: (id: string | number) => apiGet<MagazineItem | null>(`/api/magazines/${id}`),

  create: (data: Omit<MagazineItem, 'id' | 'createdAt'>) =>
    apiPost<MagazineItem>('/api/magazines', data),

  update: (id: string | number, data: Partial<MagazineItem>) =>
    apiPut<MagazineItem>(`/api/magazines/${id}`, data),

  delete: (id: string | number) => apiDelete(`/api/magazines/${id}`),
};
