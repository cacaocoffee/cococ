import { apiGet, apiPost, apiPatch, apiPut, apiDelete } from '@/lib/api';
import type {
  DepositCreateItem,
  DepositPatchPayload,
  HrApplication,
  HrDeposit,
  HrDevice,
  HrMemberDetail,
  HrOverview,
  HrSettings,
  MemberCreatePayload,
  MemberPatchPayload,
} from './hr-dto';

export const hrService = {
  fetchOverview: () => apiGet<HrOverview>('/api/hr/overview'),

  fetchMember: (id: number) => apiGet<HrMemberDetail>(`/api/hr/members/${id}`),
  createMember: (data: MemberCreatePayload) =>
    apiPost<{ id: number; relinked: number }>('/api/hr/members', data),
  updateMember: (id: number, data: MemberPatchPayload) =>
    apiPatch<{ id: number; relinked: number }>(`/api/hr/members/${id}`, data),
  deleteMember: (id: number) => apiDelete(`/api/hr/members/${id}`),
  registerFromApplications: (applicationIds: number[], joinedMonth: string) =>
    apiPost<{ created: number; skipped: number; relinked: number }>(
      '/api/hr/members/from-applications',
      { applicationIds, joinedMonth },
    ),

  fetchApplications: () => apiGet<HrApplication[]>('/api/hr/applications'),

  fetchDeposits: (month: string) =>
    apiGet<HrDeposit[]>(`/api/hr/deposits?month=${month}&limit=500`),
  createDeposits: (items: DepositCreateItem[]) =>
    apiPost<{ results: { id: number; duplicate: boolean; memberId: number | null }[] }>(
      '/api/hr/deposits',
      { items },
    ),
  updateDeposit: (id: number, data: DepositPatchPayload) =>
    apiPatch<{ id: number; relinked: number }>(`/api/hr/deposits/${id}`, data),
  deleteDeposit: (id: number) => apiDelete(`/api/hr/deposits/${id}`),

  updateSettings: (data: Partial<HrSettings>) => apiPut<HrSettings>('/api/hr/settings', data),

  fetchDevices: () => apiGet<HrDevice[]>('/api/hr/devices'),
  deleteDevice: (id: number) => apiDelete(`/api/hr/devices/${id}`),
};
