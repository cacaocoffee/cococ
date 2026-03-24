import { ARCHIVE_DATA } from '@/data';
import { createLocalStorageAPI } from '@/api/factory';

export const archiveService = createLocalStorageAPI('cococ_archive', ARCHIVE_DATA);
