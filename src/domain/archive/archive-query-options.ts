import { useQuery } from '@tanstack/react-query';
import { archiveService } from './archive-service';

export const ARCHIVE_QUERY_KEY = 'archive';

export function useArchiveList() {
  return useQuery({
    queryKey: [ARCHIVE_QUERY_KEY],
    queryFn: archiveService.fetchList,
  });
}

export function useArchiveItem(id: string | number) {
  return useQuery({
    queryKey: [ARCHIVE_QUERY_KEY, id],
    queryFn: () => archiveService.fetchById(id),
    enabled: !!id,
  });
}
