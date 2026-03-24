/**
 * 업로드 서비스
 * 현재: File → Blob URL (세션 내 임시)
 * 서버 연동 시 upload() 메서드를 fetch()로 교체하면 됩니다.
 *
 * export const uploadService = {
 *   upload: async (file) => {
 *     const form = new FormData();
 *     form.append('file', file);
 *     const res = await fetch('/api/upload', { method: 'POST', body: form });
 *     if (!res.ok) throw new Error('Upload failed');
 *     const { url } = await res.json();
 *     return url;
 *   },
 * };
 */

export const uploadService = {
  /** @param {File} file @returns {Promise<string>} URL */
  upload: async (file) => URL.createObjectURL(file),
};
