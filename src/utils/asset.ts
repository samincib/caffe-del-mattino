/**
 * Préfixe un chemin de `public/` par la base du site.
 *
 * Utile lorsque le site n'est pas servi à la racine d'un domaine : sur
 * GitHub Pages par exemple, il vit sous `/<nom-du-depot>/`. Vite expose ce
 * préfixe via `import.meta.env.BASE_URL` ('/' par défaut).
 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
