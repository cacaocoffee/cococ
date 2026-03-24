import { magazineApi } from '@/api/magazine';
import { createCRUDHooks } from './useCRUD';

const { keys, useList, useAdd, useUpdate, useRemove } = createCRUDHooks(magazineApi, 'magazine');

export const magazineKeys = keys;
export const useMagazineList = useList;
export const useAddMagazine = useAdd;
export const useUpdateMagazine = useUpdate;
export const useDeleteMagazine = useRemove;
