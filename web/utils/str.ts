export const normalizeString = (str: string) => {
  // Lowercase and remove diacritics & accents
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};
