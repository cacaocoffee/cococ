// ─── localStorage 기반 CRUD API 팩토리 ────────────────────────
// 실제 서버 연동 시 반환 객체의 각 메서드를 fetch()로 교체하면 됩니다.

export interface StorageItem {
  id: string | number;
  [key: string]: unknown;
}

export interface LocalStorageAPI<T extends StorageItem> {
  getAll: () => Promise<T[]>;
  getById: (id: string | number) => Promise<T | null>;
  add: (data: Omit<T, 'id' | 'createdAt'>) => Promise<T[]>;
  update: (id: string | number, data: Partial<T>) => Promise<T[]>;
  remove: (id: string | number) => Promise<T[]>;
}

export function createLocalStorageAPI<T extends StorageItem>(
  key: string,
  defaultData: T[],
): LocalStorageAPI<T> {
  const read = (): T[] | null => {
    try {
      return JSON.parse(localStorage.getItem(key) || 'null') as T[] | null;
    } catch {
      return null;
    }
  };
  const write = (items: T[]): void =>
    localStorage.setItem(key, JSON.stringify(items));

  return {
    getAll: async () => read() ?? defaultData,

    getById: async (id) => {
      const items = read() ?? defaultData;
      return items.find((item) => String(item.id) === String(id)) ?? null;
    },

    add: async (data) => {
      const base = read() ?? defaultData;
      const item = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...data,
      } as unknown as T;
      const updated = [item, ...base];
      write(updated);
      return updated;
    },

    update: async (id, data) => {
      const base = read() ?? defaultData;
      const updated = base.map((item) =>
        String(item.id) === String(id) ? { ...item, ...data } : item,
      );
      write(updated);
      return updated;
    },

    remove: async (id) => {
      const base = read() ?? defaultData;
      const updated = base.filter((item) => String(item.id) !== String(id));
      write(updated);
      return updated;
    },
  };
}
