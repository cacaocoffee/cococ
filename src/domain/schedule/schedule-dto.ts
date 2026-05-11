export type ScheduleType = '클래스' | '내부행사';

export interface ScheduleItem {
  id: string | number;
  title: string;
  date: string;
  endDate?: string;
  type: ScheduleType;
  archiveId: string | number | null;
  createdAt?: string;
}

export class ScheduleDTOBuilder {
  static toCreatePayload(formData: Partial<ScheduleItem>): Omit<ScheduleItem, 'id' | 'createdAt'> {
    return {
      title: formData.title ?? '',
      date: formData.date ?? '',
      endDate: formData.endDate || undefined,
      type: (formData.type as ScheduleType) ?? '클래스',
      archiveId: formData.archiveId ?? null,
    };
  }
}
