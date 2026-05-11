// ──────────────────────────────────────────────────────────
// 아카이브 서비스 (API 연동 버전)
// ──────────────────────────────────────────────────────────
// 기존: localStorage에서 데이터를 읽고 씀
// 변경: 백엔드 API 서버에 요청을 보내서 데이터를 가져옴
//
// 이 파일의 함수들은 프론트엔드 컴포넌트에서 호출됩니다.
// 함수 이름과 반환 형태를 동일하게 유지했으므로
// 컴포넌트 코드는 수정할 필요가 없습니다!
// ──────────────────────────────────────────────────────────

import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import type { ArchiveItem } from './archive-dto';

export const archiveService = {
  /** 전체 아카이브 목록을 서버에서 가져옵니다 */
  fetchList: () => apiGet<ArchiveItem[]>('/api/archives'),

  /** 특정 아카이브 1개를 ID로 조회합니다 */
  fetchById: (id: string | number) => apiGet<ArchiveItem | null>(`/api/archives/${id}`),

  /** 새 아카이브를 생성합니다 */
  create: (data: Omit<ArchiveItem, 'id' | 'createdAt'>) =>
    apiPost<ArchiveItem>('/api/archives', data),

  /** 기존 아카이브를 수정합니다 */
  update: (id: string | number, data: Partial<ArchiveItem>) =>
    apiPut<ArchiveItem>(`/api/archives/${id}`, data),

  /** 아카이브를 삭제합니다 */
  delete: (id: string | number) => apiDelete(`/api/archives/${id}`),
};
