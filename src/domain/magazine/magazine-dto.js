/**
 * @typedef {{ heading: string, body: string }} ContentSection
 *
 * @typedef {Object} MagazineItem
 * @property {string} id
 * @property {string} title
 * @property {string} author
 * @property {string} date
 * @property {string} readTime
 * @property {string} excerpt
 * @property {string} img
 * @property {string[]} tags
 * @property {ContentSection[]} content
 * @property {string} createdAt
 */

export class MagazineDTOBuilder {
  /** @param {Partial<MagazineItem>} formData @returns {Omit<MagazineItem, 'id' | 'createdAt'>} */
  static toCreatePayload(formData) {
    return {
      title: formData.title ?? '',
      author: formData.author ?? '',
      date: formData.date ?? '',
      readTime: formData.readTime ?? '',
      excerpt: formData.excerpt ?? '',
      img: formData.img ?? '',
      tags: formData.tags ?? [],
      content: formData.content ?? [],
    };
  }

  /** @param {MagazineItem} item @returns {MagazineItem} */
  static fromStorage(item) {
    return { ...item };
  }
}
