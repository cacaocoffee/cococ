import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * localStorage API 객체를 받아 TanStack Query CRUD 훅 세트를 반환하는 팩토리.
 *
 * @param {object} api - { getAll, add, update, remove }
 * @param {string} queryKey - React Query 캐시 키
 */
export function createCRUDHooks(api, queryKey) {
  const keys = { all: [queryKey] };

  return {
    keys,
    useList: () =>
      useQuery({ queryKey: keys.all, queryFn: api.getAll }),

    useAdd: () => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: (data) => api.add(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
      });
    },

    useUpdate: () => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: ({ id, data }) => api.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
      });
    },

    useRemove: () => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: (id) => api.remove(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
      });
    },
  };
}
