/**
 * Mock API — archive
 * 실제 서버 연동 시 이 파일의 함수 본문만 fetch() 로 교체하면 됩니다.
 *
 * @import { ArchiveItem } from '@/dto/archive'
 */

import { ARCHIVE_DATA } from '@/data';

const KEY = 'cococ_archive';

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}
function write(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export const archiveApi = {
  /** @returns {Promise<ArchiveItem[]>} */
  getAll: async () => read() ?? ARCHIVE_DATA,

  /** @returns {Promise<ArchiveItem|null>} */
  getById: async (id) => {
    const items = read() ?? ARCHIVE_DATA;
    return items.find((d) => String(d.id) === String(id)) ?? null;
  },

  /** @returns {Promise<ArchiveItem[]>} */
  add: async (data) => {
    const base = read() ?? ARCHIVE_DATA;
    const item = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...data };
    const updated = [item, ...base];
    write(updated);
    return updated;
  },

  /** @returns {Promise<ArchiveItem[]>} */
  update: async (id, data) => {
    const base = read() ?? ARCHIVE_DATA;
    const updated = base.map((a) => (String(a.id) === String(id) ? { ...a, ...data } : a));
    write(updated);
    return updated;
  },

  /** @returns {Promise<ArchiveItem[]>} */
  remove: async (id) => {
    const base = read() ?? ARCHIVE_DATA;
    const updated = base.filter((a) => String(a.id) !== String(id));
    write(updated);
    return updated;
  },
};
