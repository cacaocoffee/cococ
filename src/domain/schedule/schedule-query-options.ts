import { useQuery } from '@tanstack/react-query';
import { scheduleService } from './schedule-service';

export const SCHEDULE_QUERY_KEY = 'schedules';

export function scheduleListQueryOptions() {
  return {
    queryKey: [SCHEDULE_QUERY_KEY],
    queryFn: scheduleService.fetchList,
  };
}

export function useScheduleList() {
  return useQuery(scheduleListQueryOptions());
}

export function useScheduleItem(id: string | number) {
  return useQuery({
    queryKey: [SCHEDULE_QUERY_KEY, id],
    queryFn: () => scheduleService.fetchById(id),
    enabled: !!id,
  });
}
