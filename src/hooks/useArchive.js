import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { archiveApi } from '@/api/archive';

export const archiveKeys = {
  all: ['archive'],
};

export function useArchiveList() {
  return useQuery({
    queryKey: archiveKeys.all,
    queryFn: archiveApi.getAll,
  });
}

export function useAddArchive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => archiveApi.add(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: archiveKeys.all }),
  });
}

export function useUpdateArchive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => archiveApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: archiveKeys.all }),
  });
}

export function useDeleteArchive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => archiveApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: archiveKeys.all }),
  });
}
