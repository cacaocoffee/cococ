import { ARCHIVE_DATA } from '@/data';
import { createLocalStorageAPI } from '@/lib/local-storage';
import type { ArchiveItem } from './archive-dto';

const archiveStorage = createLocalStorageAPI<ArchiveItem>('cococ_archive', ARCHIVE_DATA);

export const archiveService = {
  fetchList: () => archiveStorage.getAll(),
  fetchById: (id: string | number) => archiveStorage.getById(id),
  create: (data: Omit<ArchiveItem, 'id' | 'createdAt'>) => archiveStorage.add(data),
  update: (id: string | number, data: Partial<ArchiveItem>) => archiveStorage.update(id, data),
  delete: (id: string | number) => archiveStorage.remove(id),
};
