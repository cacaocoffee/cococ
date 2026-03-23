/**
 * Mock API — magazine
 * 실제 서버 연동 시 이 파일의 함수 본문만 fetch() 로 교체하면 됩니다.
 *
 * @import { MagazineItem } from '../dto/magazine'
 */

import { MAGAZINE_DATA } from '../data';

const KEY = 'cococ_magazine';

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}
function write(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export const magazineApi = {
  /** @returns {Promise<MagazineItem[]>} */
  getAll: async () => read() ?? MAGAZINE_DATA,

  /** @returns {Promise<MagazineItem|null>} */
  getById: async (id) => {
    const items = read() ?? MAGAZINE_DATA;
    return items.find((m) => String(m.id) === String(id)) ?? null;
  },

  /** @returns {Promise<MagazineItem[]>} */
  add: async (data) => {
    const base = read() ?? MAGAZINE_DATA;
    const item = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...data };
    const updated = [item, ...base];
    write(updated);
    return updated;
  },

  /** @returns {Promise<MagazineItem[]>} */
  update: async (id, data) => {
    const base = read() ?? MAGAZINE_DATA;
    const updated = base.map((m) => (String(m.id) === String(id) ? { ...m, ...data } : m));
    write(updated);
    return updated;
  },

  /** @returns {Promise<MagazineItem[]>} */
  remove: async (id) => {
    const base = read() ?? MAGAZINE_DATA;
    const updated = base.filter((m) => String(m.id) !== String(id));
    write(updated);
    return updated;
  },
};
