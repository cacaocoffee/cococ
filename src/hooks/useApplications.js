// ─── Applications ────────────────────────────────────────────
const APP_KEY      = 'cococ_applications';
const PERIOD_KEY   = 'cococ_apply_period';

export function saveApplication(data) {
  const existing = loadApplications();
  const item = { id: Date.now().toString(), submittedAt: new Date().toISOString(), status: 'pending', ...data };
  localStorage.setItem(APP_KEY, JSON.stringify([item, ...existing]));
  return item;
}
export function loadApplications() {
  try { return JSON.parse(localStorage.getItem(APP_KEY) || '[]'); } catch { return []; }
}
export function updateStatus(id, status) {
  const updated = loadApplications().map((a) => (a.id === id ? { ...a, status } : a));
  localStorage.setItem(APP_KEY, JSON.stringify(updated));
  return updated;
}
export function deleteApplication(id) {
  const updated = loadApplications().filter((a) => a.id !== id);
  localStorage.setItem(APP_KEY, JSON.stringify(updated));
  return updated;
}

// ─── 면접/MT 설정 ─────────────────────────────────────────────
const INTERVIEW_KEY = 'cococ_interview_settings';

export const DEFAULT_INTERVIEW_SETTINGS = {
  mtDate: '추후 공지 예정',
  interviewDates: ['3/22(토)', '3/23(일)'],
  interviewTimes: ['10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-12:00', '13:00-13:30', '13:30-14:00', '14:00-14:30', '14:30-15:00'],
};

export function loadInterviewSettings() {
  try { return JSON.parse(localStorage.getItem(INTERVIEW_KEY) || 'null'); } catch { return null; }
}
export function saveInterviewSettings(settings) {
  localStorage.setItem(INTERVIEW_KEY, JSON.stringify(settings));
}

// ─── 접수 기간 ────────────────────────────────────────────────
export function loadApplyPeriod() {
  try { return JSON.parse(localStorage.getItem(PERIOD_KEY) || 'null'); } catch { return null; }
}
export function saveApplyPeriod(period) {
  localStorage.setItem(PERIOD_KEY, JSON.stringify(period));
}
export function isApplyOpen() {
  const p = loadApplyPeriod();
  if (!p || !p.start || !p.end) return true; // 미설정 시 항상 열림
  const now = new Date();
  return now >= new Date(p.start) && now <= new Date(p.end);
}

