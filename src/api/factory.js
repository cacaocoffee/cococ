/**
 * localStorage 기반 CRUD API 팩토리
 * 실제 서버 연동 시 이 팩토리 함수의 반환 객체 메서드를 fetch()로 교체하면 됩니다.
 *
 * @template T
 * @param {string} key - localStorage 키
 * @param {T[]} defaultData - 데이터가 없을 때 사용할 시드 데이터
 * @returns {{ getAll, getById, add, update, remove }}
 */
export function createLocalStorageAPI(key, defaultData) {
  const read = () => {
    try {
      return JSON.parse(localStorage.getItem(key) || 'null');
    } catch {
      return null;
    }
  };
  const write = (items) => localStorage.setItem(key, JSON.stringify(items));

  return {
    /** @returns {Promise<T[]>} */
    getAll: async () => read() ?? defaultData,

    /** @returns {Promise<T|null>} */
    getById: async (id) => {
      const items = read() ?? defaultData;
      return items.find((item) => String(item.id) === String(id)) ?? null;
    },

    /** @returns {Promise<T[]>} */
    add: async (data) => {
      const base = read() ?? defaultData;
      const item = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...data };
      const updated = [item, ...base];
      write(updated);
      return updated;
    },

    /** @returns {Promise<T[]>} */
    update: async (id, data) => {
      const base = read() ?? defaultData;
      const updated = base.map((item) =>
        String(item.id) === String(id) ? { ...item, ...data } : item
      );
      write(updated);
      return updated;
    },

    /** @returns {Promise<T[]>} */
    remove: async (id) => {
      const base = read() ?? defaultData;
      const updated = base.filter((item) => String(item.id) !== String(id));
      write(updated);
      return updated;
    },
  };
}
