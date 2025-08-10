export function generateSlug(name: string, id: string): string {
  const slugifiedName = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return `${slugifiedName}-${id}`;
}

export function extractIdFromSlug(slug: string): string | null {
  const parts = slug.split('-');
  const last = parts.at(-1);
  return last && /^\d+$/.test(last) ? last : null;
}
