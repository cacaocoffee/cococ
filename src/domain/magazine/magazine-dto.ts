export interface ContentSection {
  heading: string;
  body: string;
}

export interface MagazineItem {
  id: string | number;
  title: string;
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  img: string;
  tags: string[];
  magazineType?: string;
  instagramUrls?: string[];
  content: ContentSection[];
  createdAt?: string;
}

export class MagazineDTOBuilder {
  static toCreatePayload(formData: Partial<MagazineItem>): Omit<MagazineItem, 'id' | 'createdAt'> {
    return {
      title: formData.title ?? '',
      author: formData.author ?? '',
      date: formData.date ?? '',
      readTime: formData.readTime ?? '',
      excerpt: formData.excerpt ?? '',
      img: formData.img ?? '',
      tags: formData.tags ?? [],
      magazineType: formData.magazineType ?? '',
      instagramUrls: formData.instagramUrls ?? [],
      content: formData.content ?? [],
    };
  }

  static fromStorage(item: MagazineItem): MagazineItem {
    return { ...item };
  }
}
