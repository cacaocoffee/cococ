export interface ScheduleEvent {
  id: number;
  title: string;
  date: string;
  endDate?: string;
  type: '클래스' | '내부행사';
  archiveId: number | null;
}

export class ScheduleDTOBuilder {
  static toCreatePayload(formData: Partial<ScheduleEvent>): Omit<ScheduleEvent, 'id'> {
    return {
      title: formData.title ?? '',
      date: formData.date ?? '',
      endDate: formData.endDate,
      type: formData.type ?? '클래스',
      archiveId: formData.archiveId ?? null,
    };
  }
}
