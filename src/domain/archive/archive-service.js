import { ARCHIVE_DATA } from '@/data';
import { createLocalStorageAPI } from '@/lib/local-storage';

const archiveStorage = createLocalStorageAPI('cococ_archive', ARCHIVE_DATA);

export const archiveService = {
  fetchList: () => archiveStorage.getAll(),
  fetchById: (id) => archiveStorage.getById(id),
  create: (data) => archiveStorage.add(data),
  update: (id, data) => archiveStorage.update(id, data),
  delete: (id) => archiveStorage.remove(id),
};
