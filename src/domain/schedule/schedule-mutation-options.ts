import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from './schedule-service';
import { SCHEDULE_QUERY_KEY } from './schedule-query-options';
import type { ScheduleEvent } from './schedule-dto';

function useInvalidateSchedule() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: [SCHEDULE_QUERY_KEY] });
}

export function useAddSchedule() {
  const invalidate = useInvalidateSchedule();
  return useMutation({
    mutationFn: (data: Omit<ScheduleEvent, 'id'>) => scheduleService.create(data),
    onSuccess: invalidate,
  });
}

export function useUpdateSchedule() {
  const invalidate = useInvalidateSchedule();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ScheduleEvent> }) =>
      scheduleService.update(id, data),
    onSuccess: invalidate,
  });
}

export function useDeleteSchedule() {
  const invalidate = useInvalidateSchedule();
  return useMutation({
    mutationFn: (id: number) => scheduleService.delete(id),
    onSuccess: invalidate,
  });
}
