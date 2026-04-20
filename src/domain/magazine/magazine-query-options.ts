import { useQuery } from '@tanstack/react-query';
import { magazineService } from './magazine-service';

export const MAGAZINE_QUERY_KEY = 'magazine';

export function useMagazineList() {
  return useQuery({
    queryKey: [MAGAZINE_QUERY_KEY],
    queryFn: magazineService.fetchList,
  });
}

export function useMagazineItem(id: string | number) {
  return useQuery({
    queryKey: [MAGAZINE_QUERY_KEY, id],
    queryFn: () => magazineService.fetchById(id),
    enabled: !!id,
  });
}
