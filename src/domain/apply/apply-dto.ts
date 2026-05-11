export interface ApplicationItem {
  id: string;
  submittedAt: string;
  status: 'pending' | 'pass' | 'fail';
  generation?: number;
  name: string;
  gender: string;
  birthdate: string;
  phone: string;
  email: string;
  sns?: string;
  mtAvailable: string;
  mainContact: string;
  availableTimes: string[];
  interviewTimes: string[];
  scaleGourmet: number;
  scalePeople: number;
  q3_1_style: string;
  q1_intro: string;
  q2_drink: string;
  q3_2_reason: string;
  qEtc?: string;
}

export interface InterviewSettings {
  mtDate: string;
  interviewDates: string[];
  interviewTimes: string[];
}

export interface ApplyPeriod {
  start: string;
  end: string;
  forceClosed?: boolean;
  generation?: number;
}
