import { useMutation, useQueryClient } from '@tanstack/react-query';
import { magazineService } from './magazine-service';
import { MAGAZINE_QUERY_KEY } from './magazine-query-options';

function useInvalidateMagazine() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: [MAGAZINE_QUERY_KEY] });
}

export function useAddMagazine() {
  const invalidate = useInvalidateMagazine();
  return useMutation({ mutationFn: magazineService.create, onSuccess: invalidate });
}

export function useUpdateMagazine() {
  const invalidate = useInvalidateMagazine();
  return useMutation({
    mutationFn: ({ id, data }) => magazineService.update(id, data),
    onSuccess: invalidate,
  });
}

export function useDeleteMagazine() {
  const invalidate = useInvalidateMagazine();
  return useMutation({ mutationFn: magazineService.delete, onSuccess: invalidate });
}
