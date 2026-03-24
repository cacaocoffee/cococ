import { ARCHIVE_DATA } from '@/data';
import { createLocalStorageAPI } from './factory';

export const archiveApi = createLocalStorageAPI('cococ_archive', ARCHIVE_DATA);
