import { useMutation, useQueryClient } from '@tanstack/react-query';
import { archiveService } from './archive-service';
import { ARCHIVE_QUERY_KEY } from './archive-query-options';
import type { ArchiveItem } from './archive-dto';

function useInvalidateArchive() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: [ARCHIVE_QUERY_KEY] });
}

export function useAddArchive() {
  const invalidate = useInvalidateArchive();
  return useMutation({
    mutationFn: (data: Omit<ArchiveItem, 'id' | 'createdAt'>) => archiveService.create(data),
    onSuccess: invalidate,
  });
}

export function useUpdateArchive() {
  const invalidate = useInvalidateArchive();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<ArchiveItem> }) =>
      archiveService.update(id, data),
    onSuccess: invalidate,
  });
}

export function useDeleteArchive() {
  const invalidate = useInvalidateArchive();
  return useMutation({
    mutationFn: (id: string | number) => archiveService.delete(id),
    onSuccess: invalidate,
  });
}
