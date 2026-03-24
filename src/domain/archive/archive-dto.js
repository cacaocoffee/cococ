/**
 * @typedef {{ name: string, ingredients: string }} Recipe
 *
 * @typedef {Object} ArchiveItem
 * @property {string} id
 * @property {string} year
 * @property {string} semester
 * @property {string} category
 * @property {string} title
 * @property {string} date
 * @property {string} base
 * @property {string} img
 * @property {number} participants
 * @property {string} location
 * @property {string} description
 * @property {string[]} tags
 * @property {string[]} gallery
 * @property {Recipe[]} recipes
 * @property {string} createdAt
 */

export class ArchiveDTOBuilder {
  /** @param {Partial<ArchiveItem>} formData @returns {Omit<ArchiveItem, 'id' | 'createdAt'>} */
  static toCreatePayload(formData) {
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
    };
  }

  /** @param {ArchiveItem} item @returns {ArchiveItem} */
  static fromStorage(item) {
    return { ...item, participants: Number(item.participants) || 0 };
  }
}
