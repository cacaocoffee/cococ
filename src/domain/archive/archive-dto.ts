export interface Recipe {
  name: string;
  ingredients: string;
  img?: string;
}

export interface ArchiveItem {
  id: string | number;
  year: string;
  semester?: string;
  category: string;
  title: string;
  date: string;
  base: string;
  img: string;
  participants: number;
  location: string;
  description: string;
  tags: string[];
  gallery: string[];
  recipes: Recipe[];
  content: unknown[];
  createdAt?: string;
}

export class ArchiveDTOBuilder {
  static toCreatePayload(formData: Partial<ArchiveItem>): Omit<ArchiveItem, 'id' | 'createdAt'> {
    return {
      year: formData.year ?? '',
      semester: formData.semester ?? '',
      category: formData.category ?? '',
      title: formData.title ?? '',
      date: formData.date ?? '',
      base: formData.base ?? '',
      img: formData.img ?? '',
      participants: Number(formData.participants) || 0,
      location: formData.location ?? '',
      description: formData.description ?? '',
      tags: formData.tags ?? [],
      gallery: formData.gallery ?? [],
      recipes: formData.recipes ?? [],
      content: formData.content ?? [],
    };
  }

  static fromStorage(item: ArchiveItem): ArchiveItem {
    return { ...item, participants: Number(item.participants) || 0 };
  }
}
