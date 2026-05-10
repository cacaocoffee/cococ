import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-client';
import type { ScheduleEvent } from './schedule-dto';

export const scheduleService = {
  fetchList: () => apiGet<ScheduleEvent[]>('/api/schedules'),
  create: (data: Omit<ScheduleEvent, 'id'>) =>
    apiPost<ScheduleEvent>('/api/schedules', data),
  update: (id: number, data: Partial<ScheduleEvent>) =>
    apiPut<ScheduleEvent>(`/api/schedules/${id}`, data),
  delete: (id: number) => apiDelete(`/api/schedules/${id}`),
};
