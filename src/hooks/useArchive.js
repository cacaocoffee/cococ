import { archiveApi } from '@/api/archive';
import { createCRUDHooks } from './useCRUD';

const { keys, useList, useAdd, useUpdate, useRemove } = createCRUDHooks(archiveApi, 'archive');

export const archiveKeys = keys;
export const useArchiveList = useList;
export const useAddArchive = useAdd;
export const useUpdateArchive = useUpdate;
export const useDeleteArchive = useRemove;
