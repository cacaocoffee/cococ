/**
 * Mock Upload API
 *
 * Mock: File → blob URL (현재 세션에서만 유효)
 * 실제 서버 연동 시 아래 주석 코드로 교체:
 *
 * export const uploadApi = {
 *   upload: async (file) => {
 *     const form = new FormData();
 *     form.append('file', file);
 *     const res = await fetch('/api/upload', { method: 'POST', body: form });
 *     if (!res.ok) throw new Error('Upload failed');
 *     const { url } = await res.json();  // { url: "https://cdn.example.com/..." }
 *     return url;
 *   },
 * };
 */

export const uploadApi = {
  /** @param {File} file @returns {Promise<string>} URL */
  upload: async (file) => {
    // 실제 서버 없이 브라우저에서 임시 미리보기 URL 생성
    return URL.createObjectURL(file);
  },
};
