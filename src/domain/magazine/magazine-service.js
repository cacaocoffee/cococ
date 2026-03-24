import { MAGAZINE_DATA } from '@/data';
import { createLocalStorageAPI } from '@/api/factory';

export const magazineService = createLocalStorageAPI('cococ_magazine', MAGAZINE_DATA);
