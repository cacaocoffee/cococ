import { SCHEDULE_DATA } from '@/data';
import { createLocalStorageAPI } from '@/lib/local-storage';
import type { ScheduleItem } from './schedule-dto';

const scheduleStorage = createLocalStorageAPI<ScheduleItem>(
  'cococ_schedule',
  SCHEDULE_DATA as ScheduleItem[],
);

export const scheduleService = {
  fetchList: () => scheduleStorage.getAll(),
  fetchById: (id: string | number) => scheduleStorage.getById(id),
  create: (data: Omit<ScheduleItem, 'id' | 'createdAt'>) => scheduleStorage.add(data),
  update: (id: string | number, data: Partial<ScheduleItem>) => scheduleStorage.update(id, data),
  delete: (id: string | number) => scheduleStorage.remove(id),
};
