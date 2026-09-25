/**
 * Pipeline d'images — Caffè Del Mattino
 * ------------------------------------------------------------------
 * Lit les originaux dans `assets-source/` et génère dans `public/images/`
 * des versions recadrees, etalonnees et compressees (WebP + JPEG),
 * en plusieurs largeurs pour le `srcset`.
 *
 * Lancer :  npm run images
 *
 * Pour remplacer une photo : deposez le nouveau fichier dans
 * `assets-source/cafe/` (ou `assets-source/web/`) en gardant le meme nom,
 * ajustez si besoin le `crop` ci-dessous, puis relancez `npm run images`.
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'assets-source');
const OUT = path.join(ROOT, 'public', 'images');

/** Etalonnage maison : chaud, legerement contraste, sans saturation criarde. */
const GRADES = {
  // Photos reelles du cafe : plein soleil / interieur -> on rechauffe et on densifie.
  cafe: (img) => img.modulate({ saturation: 1.1, brightness: 1.02 }).linear(1.06, -9).gamma(1.05),
  // Photos d'illustration : on les aligne sur la meme temperature chaude.
  web: (img) => img.modulate({ saturation: 1.04, brightness: 1.01 }).linear(1.03, -5),
  // Textures de fond : desaturees et assombries, elles passent sous du texte.
  texture: (img) => img.modulate({ saturation: 0.75, brightness: 0.82 }).blur(1.2),
};

/**
 * `crop` est exprime en ratios (0 -> 1) de l'image source, ce qui permet de
 * remplacer une photo par une autre resolution sans recalculer des pixels.
 */
const RECIPES = [
  /* ---------- Photos reelles : la facade (IMG_5806) ---------- */
  {
    src: 'cafe/facade-originale.jpg',
    name: 'facade-hero',
    grade: 'cafe',
    // Cadrage volontairement arrete avant la terrasse de droite : les clients
    // presents sur la photo d'origine sont identifiables (voir README).
    // Ratio ~3/2 : proche d'un hero large, l'enseigne reste donc entiere
    // meme apres le recadrage automatique du navigateur (object-cover).
    crop: { x: 0.02, y: 0.25, w: 0.61, h: 0.55 },
    widths: [640, 1280, 1920],
  },
  {
    // Hero mobile : l'interieur passe mieux en format vertical que la facade.
    // Cadre sur le mur vegetal, l'ardoise en bois et la table -> ratio ~9/20,
    // proche d'un ecran de telephone, donc presque aucun recadrage a l'affichage.
    src: 'cafe/interieur-originale.jpg',
    name: 'hero-mobile',
    grade: 'cafe',
    crop: { x: 0.367, y: 0.19, w: 0.467, h: 0.76 },
    widths: [480, 900],
  },
  {
    src: 'cafe/facade-originale.jpg',
    name: 'facade-enseigne',
    grade: 'cafe',
    crop: { x: 0.09, y: 0.3, w: 0.56, h: 0.145 }, // gros plan sur l'enseigne noire
    widths: [640, 1200],
  },
  {
    src: 'cafe/facade-originale.jpg',
    name: 'facade-terrasse',
    grade: 'cafe',
    crop: { x: 0.0, y: 0.45, w: 0.42, h: 0.55 }, // coin terrasse : mange-debout et claustra
    widths: [480, 960],
  },

  /* ---------- Photos reelles : l'interieur et le menu (IMG_5805) ---------- */
  {
    src: 'cafe/interieur-originale.jpg',
    name: 'menu-tableau',
    grade: 'cafe',
    crop: { x: 0.38, y: 0.19, w: 0.39, h: 0.56 }, // la grande ardoise en bois
    widths: [480, 960],
  },
  {
    src: 'cafe/interieur-originale.jpg',
    name: 'salle',
    grade: 'cafe',
    crop: { x: 0.03, y: 0.42, w: 0.8, h: 0.5 }, // mur vegetal + ardoise + table
    widths: [640, 1280],
  },
  {
    // La petite pancarte « Petit déjeuner » accrochee a gauche du mur vegetal :
    // un plan different de la grande ardoise, qui evitait un doublon en galerie.
    src: 'cafe/interieur-originale.jpg',
    name: 'pancarte-petit-dejeuner',
    grade: 'cafe',
    crop: { x: 0.17, y: 0.19, w: 0.28, h: 0.26 },
    widths: [400, 800],
  },
  {
    src: 'cafe/interieur-originale.jpg',
    name: 'texture-vegetale',
    grade: 'texture',
    crop: { x: 0.3, y: 0.1, w: 0.38, h: 0.11 }, // mur de feuillage -> texture de fond
    widths: [640, 1280],
  },

  /* ---------- Illustrations libres de droits (Unsplash) ---------- */
  { src: 'web/espresso.jpg', name: 'cat-cafe', grade: 'web', crop: { x: 0.08, y: 0, w: 0.84, h: 1 }, widths: [400, 800] },
  { src: 'web/the-verre.jpg', name: 'cat-the', grade: 'web', crop: { x: 0.06, y: 0.28, w: 0.5, h: 0.5 }, widths: [400, 800] },
  { src: 'web/citronnade.jpg', name: 'cat-jus', grade: 'web', crop: { x: 0.12, y: 0, w: 0.76, h: 1 }, widths: [400, 800] },
  { src: 'web/croissant.jpg', name: 'cat-patisserie', grade: 'web', crop: { x: 0.05, y: 0.05, w: 0.9, h: 0.9 }, widths: [400, 800] },
  { src: 'web/petit-dejeuner.jpg', name: 'cat-petit-dejeuner', grade: 'web', crop: { x: 0.05, y: 0.02, w: 0.9, h: 0.96 }, widths: [400, 800] },
  { src: 'web/jus-orange.jpg', name: 'ambiance-jus', grade: 'web', crop: { x: 0.1, y: 0, w: 0.8, h: 1 }, widths: [400, 800] },
  { src: 'web/cafe-plantes.jpg', name: 'ambiance-tasses', grade: 'web', crop: { x: 0.04, y: 0.05, w: 0.92, h: 0.9 }, widths: [480, 960] },
  { src: 'web/entre-amis.jpg', name: 'ambiance-amis', grade: 'web', crop: { x: 0.05, y: 0.08, w: 0.9, h: 0.84 }, widths: [480, 960] },
  { src: 'web/cookies.jpg', name: 'ambiance-douceurs', grade: 'web', crop: { x: 0.08, y: 0.08, w: 0.84, h: 0.84 }, widths: [480, 960] },
  { src: 'web/cafe-bois.jpg', name: 'bande-bois', grade: 'texture', crop: { x: 0, y: 0.08, w: 1, h: 0.84 }, widths: [800, 1600] },
];

/** Image sociale (Open Graph) : 1200x630 fabriquee a partir de la facade. */
const OG = { src: 'cafe/facade-originale.jpg', crop: { x: 0.02, y: 0.26, w: 0.61, h: 0.6 } };

async function cropPipeline(file, recipe) {
  const img = sharp(file, { failOn: 'none' }).rotate(); // .rotate() applique l'orientation EXIF
  const meta = await img.metadata();
  // metadata() renvoie les dimensions AVANT rotation : on les remet a l'endroit
  // (photos iPhone verticales = orientation 5 a 8).
  const swap = meta.orientation >= 5 && meta.orientation <= 8;
  const width = swap ? meta.height : meta.width;
  const height = swap ? meta.width : meta.height;

  const c = recipe.crop;
  const region = {
    left: Math.round(c.x * width),
    top: Math.round(c.y * height),
    width: Math.round(c.w * width),
    height: Math.round(c.h * height),
  };
  region.width = Math.min(region.width, width - region.left);
  region.height = Math.min(region.height, height - region.top);
  return { img: img.extract(region), region };
}

async function run() {
  await fs.mkdir(OUT, { recursive: true });
  let count = 0;

  for (const recipe of RECIPES) {
    const file = path.join(SRC, recipe.src);
    try {
      await fs.access(file);
    } catch {
      console.warn(`  !  source absente, ignoree : ${recipe.src}`);
      continue;
    }
    const { img, region } = await cropPipeline(file, recipe);
    const graded = GRADES[recipe.grade](img);

    for (const w of recipe.widths) {
      const base = graded.clone().resize({ width: w, withoutEnlargement: true });
      await base.clone().webp({ quality: 74, effort: 5 }).toFile(path.join(OUT, `${recipe.name}-${w}.webp`));
      await base.clone().jpeg({ quality: 76, mozjpeg: true, progressive: true }).toFile(path.join(OUT, `${recipe.name}-${w}.jpg`));
      count += 2;
    }
    console.log(`  ok ${recipe.name.padEnd(22)} ${region.width}x${region.height} -> ${recipe.widths.join(', ')}`);
  }

  // Open Graph : format impose 1200x630.
  const ogFile = path.join(SRC, OG.src);
  const { img: ogImg } = await cropPipeline(ogFile, OG);
  await GRADES.cafe(ogImg).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(OUT, 'og-image.jpg'));
  console.log('  ok og-image             1200x630');

  console.log(`\n${count + 1} fichiers generes dans public/images/`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
