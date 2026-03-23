import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { magazineApi } from '../api/magazine';

export const magazineKeys = {
  all: ['magazine'],
};

export function useMagazineList() {
  return useQuery({
    queryKey: magazineKeys.all,
    queryFn: magazineApi.getAll,
  });
}

export function useAddMagazine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => magazineApi.add(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: magazineKeys.all }),
  });
}

export function useUpdateMagazine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => magazineApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: magazineKeys.all }),
  });
}

export function useDeleteMagazine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => magazineApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: magazineKeys.all }),
  });
}
