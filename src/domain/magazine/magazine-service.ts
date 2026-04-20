import { MAGAZINE_DATA } from '@/data';
import { createLocalStorageAPI } from '@/lib/local-storage';
import type { MagazineItem } from './magazine-dto';

const magazineStorage = createLocalStorageAPI<MagazineItem>('cococ_magazine', MAGAZINE_DATA);

export const magazineService = {
  fetchList: () => magazineStorage.getAll(),
  fetchById: (id: string | number) => magazineStorage.getById(id),
  create: (data: Omit<MagazineItem, 'id' | 'createdAt'>) => magazineStorage.add(data),
  update: (id: string | number, data: Partial<MagazineItem>) => magazineStorage.update(id, data),
  delete: (id: string | number) => magazineStorage.remove(id),
};
