/**
 * Met un texte à plat pour la recherche : minuscules et accents retirés.
 * « Thé Amande » et « the amande » doivent donner le même résultat.
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

/** Le produit correspond-il à la requête (nom ou description) ? */
export function matches(query: string, ...fields: (string | undefined)[]): boolean {
  const q = normalize(query);
  if (!q) return true;
  const haystack = normalize(fields.filter(Boolean).join(' '));
  // Chaque mot saisi doit être présent : « the amande » trouve « Thé Amande ».
  return q.split(/\s+/).every((word) => haystack.includes(word));
}
