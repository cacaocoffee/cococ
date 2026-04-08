import type { ApplicationItem, InterviewSettings, ApplyPeriod } from './apply-dto';

const APP_KEY = 'cococ_applications';

export const applyService = {
  loadApplications(): ApplicationItem[] {
    try {
      return JSON.parse(localStorage.getItem(APP_KEY) || '[]') as ApplicationItem[];
    } catch {
      return [];
    }
  },

  saveApplication(data: Omit<ApplicationItem, 'id' | 'submittedAt' | 'status'>): ApplicationItem {
    const existing = applyService.loadApplications();
    const item: ApplicationItem = {
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'pending',
      ...data,
    };
    localStorage.setItem(APP_KEY, JSON.stringify([item, ...existing]));
    return item;
  },

  updateStatus(id: string, status: ApplicationItem['status']): ApplicationItem[] {
    const updated = applyService.loadApplications().map((a) =>
      a.id === id ? { ...a, status } : a,
    );
    localStorage.setItem(APP_KEY, JSON.stringify(updated));
    return updated;
  },

  updateFields(id: string, fields: Partial<ApplicationItem>): ApplicationItem[] {
    const updated = applyService.loadApplications().map((a) =>
      a.id === id ? { ...a, ...fields } : a,
    );
    localStorage.setItem(APP_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteApplication(id: string): ApplicationItem[] {
    const updated = applyService.loadApplications().filter((a) => a.id !== id);
    localStorage.setItem(APP_KEY, JSON.stringify(updated));
    return updated;
  },

  DEFAULT_INTERVIEW_SETTINGS: {
    mtDate: '추후 공지 예정',
    interviewDates: ['3/22(토)', '3/23(일)'],
    interviewTimes: [
      '10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-12:00',
      '13:00-13:30', '13:30-14:00', '14:00-14:30', '14:30-15:00',
    ],
  } satisfies InterviewSettings,

  loadInterviewSettings(): InterviewSettings | null {
    try {
      return JSON.parse(localStorage.getItem('cococ_interview_settings') || 'null') as InterviewSettings | null;
    } catch {
      return null;
    }
  },

  saveInterviewSettings(settings: InterviewSettings): void {
    localStorage.setItem('cococ_interview_settings', JSON.stringify(settings));
  },

  loadApplyPeriod(): ApplyPeriod | null {
    try {
      return JSON.parse(localStorage.getItem('cococ_apply_period') || 'null') as ApplyPeriod | null;
    } catch {
      return null;
    }
  },

  saveApplyPeriod(period: ApplyPeriod): void {
    localStorage.setItem('cococ_apply_period', JSON.stringify(period));
  },

  isApplyOpen(): boolean {
    const p = applyService.loadApplyPeriod();
    if (!p || !p.start || !p.end) return true;
    if (p.forceClosed) return false;
    const now = new Date();
    return now >= new Date(p.start) && now <= new Date(p.end);
  },
};
