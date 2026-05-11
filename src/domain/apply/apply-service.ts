// ──────────────────────────────────────────────────────────
// 지원서 서비스 (API 연동 버전)
// ──────────────────────────────────────────────────────────
// 기존: localStorage에 직접 저장
// 변경: 백엔드 API에 요청
//
// ⚠️ 주의: 기존에는 동기(sync) 함수였지만,
//    API 호출은 비동기(async)이므로 모든 함수가 Promise를 반환합니다.
//    호출하는 곳에서 await를 붙여야 합니다.
// ──────────────────────────────────────────────────────────

import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/lib/api';
import type { ApplicationItem, InterviewSettings, ApplyPeriod } from './apply-dto';

export const applyService = {
  // ── 지원서 관련 ────────────────────────────────────────

  /** 전체 지원서 목록 조회 */
  async loadApplications(): Promise<ApplicationItem[]> {
    return apiGet<ApplicationItem[]>('/api/apply/applications');
  },

  /** 새 지원서 제출 */
  async saveApplication(
    data: Omit<ApplicationItem, 'id' | 'submittedAt' | 'status'>,
  ): Promise<ApplicationItem> {
    return apiPost<ApplicationItem>('/api/apply/applications', data);
  },

  /** 지원서 상태 변경 (합격/불합격) */
  async updateStatus(
    id: string,
    status: ApplicationItem['status'],
  ): Promise<ApplicationItem> {
    return apiPatch<ApplicationItem>(`/api/apply/applications/${id}`, { status });
  },

  /** 지원서 필드 일부 수정 */
  async updateFields(
    id: string,
    fields: Partial<ApplicationItem>,
  ): Promise<ApplicationItem> {
    return apiPatch<ApplicationItem>(`/api/apply/applications/${id}`, fields);
  },

  /** 지원서 삭제 */
  async deleteApplication(id: string): Promise<void> {
    return apiDelete(`/api/apply/applications/${id}`);
  },

  // ── 면접 설정 ──────────────────────────────────────────

  DEFAULT_INTERVIEW_SETTINGS: {
    mtDate: '추후 공지 예정',
    interviewDates: ['3/22(토)', '3/23(일)'],
    interviewTimes: [
      '10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-12:00',
      '13:00-13:30', '13:30-14:00', '14:00-14:30', '14:30-15:00',
    ],
  } satisfies InterviewSettings,

  /** 면접 설정 조회 */
  async loadInterviewSettings(): Promise<InterviewSettings | null> {
    return apiGet<InterviewSettings | null>('/api/apply/interview-settings');
  },

  /** 면접 설정 저장 */
  async saveInterviewSettings(settings: InterviewSettings): Promise<void> {
    await apiPut('/api/apply/interview-settings', settings);
  },

  // ── 지원 기간 ──────────────────────────────────────────

  /** 지원 기간 조회 */
  async loadApplyPeriod(): Promise<ApplyPeriod | null> {
    return apiGet<ApplyPeriod | null>('/api/apply/period');
  },

  /** 지원 기간 설정 */
  async saveApplyPeriod(period: ApplyPeriod): Promise<void> {
    await apiPut('/api/apply/period', period);
  },

  /** 지원 가능 여부 확인 */
  async isApplyOpen(): Promise<boolean> {
    const result = await apiGet<{ open: boolean }>('/api/apply/is-open');
    return result.open;
  },
};
