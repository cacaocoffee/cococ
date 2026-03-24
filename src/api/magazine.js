import { MAGAZINE_DATA } from '@/data';
import { createLocalStorageAPI } from './factory';

export const magazineApi = createLocalStorageAPI('cococ_magazine', MAGAZINE_DATA);
