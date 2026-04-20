import { useMutation, useQueryClient } from '@tanstack/react-query';
import { magazineService } from './magazine-service';
import { MAGAZINE_QUERY_KEY } from './magazine-query-options';
import type { MagazineItem } from './magazine-dto';

function useInvalidateMagazine() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: [MAGAZINE_QUERY_KEY] });
}

export function useAddMagazine() {
  const invalidate = useInvalidateMagazine();
  return useMutation({
    mutationFn: (data: Omit<MagazineItem, 'id' | 'createdAt'>) => magazineService.create(data),
    onSuccess: invalidate,
  });
}

export function useUpdateMagazine() {
  const invalidate = useInvalidateMagazine();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<MagazineItem> }) =>
      magazineService.update(id, data),
    onSuccess: invalidate,
  });
}

export function useDeleteMagazine() {
  const invalidate = useInvalidateMagazine();
  return useMutation({
    mutationFn: (id: string | number) => magazineService.delete(id),
    onSuccess: invalidate,
  });
}
