import { useQuery } from '@tanstack/react-query';
import { scheduleService } from './schedule-service';

export const SCHEDULE_QUERY_KEY = 'schedules';

export function scheduleListQueryOptions() {
  return {
    queryKey: [SCHEDULE_QUERY_KEY] as const,
    queryFn: scheduleService.fetchList,
  };
}

export function useScheduleList() {
  return useQuery(scheduleListQueryOptions());
}
