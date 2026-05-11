import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from './schedule-service';
import { SCHEDULE_QUERY_KEY } from './schedule-query-options';
import type { ScheduleItem } from './schedule-dto';

function useInvalidateSchedule() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: [SCHEDULE_QUERY_KEY] });
}

export function useAddSchedule() {
  const invalidate = useInvalidateSchedule();
  return useMutation({
    mutationFn: (data: Omit<ScheduleItem, 'id' | 'createdAt'>) => scheduleService.create(data),
    onSuccess: invalidate,
  });
}

export function useUpdateSchedule() {
  const invalidate = useInvalidateSchedule();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<ScheduleItem> }) =>
      scheduleService.update(id, data),
    onSuccess: invalidate,
  });
}

export function useDeleteSchedule() {
  const invalidate = useInvalidateSchedule();
  return useMutation({
    mutationFn: (id: string | number) => scheduleService.delete(id),
    onSuccess: invalidate,
  });
}
