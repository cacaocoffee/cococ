import { useMutation, useQueryClient } from '@tanstack/react-query';
import { archiveService } from './archive-service';
import { ARCHIVE_QUERY_KEY } from './archive-query-options';

function useInvalidateArchive() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: [ARCHIVE_QUERY_KEY] });
}

export function useAddArchive() {
  const invalidate = useInvalidateArchive();
  return useMutation({ mutationFn: archiveService.create, onSuccess: invalidate });
}

export function useUpdateArchive() {
  const invalidate = useInvalidateArchive();
  return useMutation({
    mutationFn: ({ id, data }) => archiveService.update(id, data),
    onSuccess: invalidate,
  });
}

export function useDeleteArchive() {
  const invalidate = useInvalidateArchive();
  return useMutation({ mutationFn: archiveService.delete, onSuccess: invalidate });
}
