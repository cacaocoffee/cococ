// ─── 지원서 ───────────────────────────────────────────────────
const APP_KEY = 'cococ_applications';

export const applyService = {
  // ── 지원서 CRUD ─────────────────────────────────────────────
  loadApplications() {
    try { return JSON.parse(localStorage.getItem(APP_KEY) || '[]'); } catch { return []; }
  },

  saveApplication(data) {
    const existing = applyService.loadApplications();
    const item = {
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'pending',
      ...data,
    };
    localStorage.setItem(APP_KEY, JSON.stringify([item, ...existing]));
    return item;
  },

  updateStatus(id, status) {
    const updated = applyService.loadApplications().map((a) =>
      a.id === id ? { ...a, status } : a,
    );
    localStorage.setItem(APP_KEY, JSON.stringify(updated));
    return updated;
  },

  updateFields(id, fields) {
    const updated = applyService.loadApplications().map((a) =>
      a.id === id ? { ...a, ...fields } : a,
    );
    localStorage.setItem(APP_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteApplication(id) {
    const updated = applyService.loadApplications().filter((a) => a.id !== id);
    localStorage.setItem(APP_KEY, JSON.stringify(updated));
    return updated;
  },

  // ── 면접 / MT 설정 ───────────────────────────────────────────
  DEFAULT_INTERVIEW_SETTINGS: {
    mtDate: '추후 공지 예정',
    interviewDates: ['3/22(토)', '3/23(일)'],
    interviewTimes: [
      '10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-12:00',
      '13:00-13:30', '13:30-14:00', '14:00-14:30', '14:30-15:00',
    ],
  },

  loadInterviewSettings() {
    try { return JSON.parse(localStorage.getItem('cococ_interview_settings') || 'null'); } catch { return null; }
  },

  saveInterviewSettings(settings) {
    localStorage.setItem('cococ_interview_settings', JSON.stringify(settings));
  },

  // ── 접수 기간 ────────────────────────────────────────────────
  loadApplyPeriod() {
    try { return JSON.parse(localStorage.getItem('cococ_apply_period') || 'null'); } catch { return null; }
  },

  saveApplyPeriod(period) {
    localStorage.setItem('cococ_apply_period', JSON.stringify(period));
  },

  isApplyOpen() {
    const p = applyService.loadApplyPeriod();
    if (!p || !p.start || !p.end) return true;
    const now = new Date();
    return now >= new Date(p.start) && now <= new Date(p.end);
  },
};
