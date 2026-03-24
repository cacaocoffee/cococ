import { MAGAZINE_DATA } from '@/data';
import { createLocalStorageAPI } from '@/lib/local-storage';

const magazineStorage = createLocalStorageAPI('cococ_magazine', MAGAZINE_DATA);

export const magazineService = {
  fetchList: () => magazineStorage.getAll(),
  fetchById: (id) => magazineStorage.getById(id),
  create: (data) => magazineStorage.add(data),
  update: (id, data) => magazineStorage.update(id, data),
  delete: (id) => magazineStorage.remove(id),
};
