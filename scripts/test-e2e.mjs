import { chromium } from 'playwright-core';
import fs from 'node:fs';

const OUT = process.argv[2];
const URL = 'http://localhost:4173/';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
fs.mkdirSync(OUT, { recursive: true });

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' :: ' + detail : ''}`);
};

const browser = await chromium.launch({ executablePath: CHROME });

/* ---------------------------------------------------------------- MOBILE */
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await mobile.newPage();
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);

check('Titre de page', (await page.title()).includes('Caffè Del Mattino'), await page.title());
check('Hero affiché', await page.getByRole('heading', { name: 'Caffè Del Mattino', level: 1 }).isVisible());
await page.screenshot({ path: `${OUT}/01-mobile-hero.png` });

/* --- Pas de débordement horizontal --- */
const overflow = await page.evaluate(() => ({
  scroll: document.documentElement.scrollWidth,
  client: document.documentElement.clientWidth,
}));
check('Aucun débordement horizontal (390px)', overflow.scroll <= overflow.client + 1, `scroll=${overflow.scroll} client=${overflow.client}`);

/* --- Menu mobile --- */
await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
await page.waitForTimeout(400);
check('Menu mobile ouvert', await page.getByRole('navigation', { name: 'Navigation mobile' }).getByRole('link', { name: 'Galerie' }).isVisible());
await page.screenshot({ path: `${OUT}/02-mobile-nav.png` });
await page.getByRole('navigation', { name: 'Navigation mobile' }).getByRole('link', { name: 'Menu', exact: true }).click();
await page.waitForTimeout(900);
check('Navigation vers #menu', page.url().includes('#menu'), page.url());

/* --- Comptage des produits --- */
await page.locator('#menu').scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
const cards = await page.locator('#menu article').count();
check('23 produits affichés', cards === 23, `${cards} trouvés`);
await page.screenshot({ path: `${OUT}/03-mobile-menu.png` });

/* --- Vérification de chaque prix affiché --- */
const expected = [
  ['Petit déjeuner', '9 DT'], ['Petit déjeuner Royal', '9 DT'],
  ['Express', '2 DT'], ['Capucin', '2,20 DT'], ['Direct', '2,30 DT'], ['Chocolat au lait', '2 DT'],
  ['Thé Vert', '1,50 DT'], ['Thé Amande', '2,70 DT'], ['Thé Noisette', '2,70 DT'], ['Thé Baklawa', '5,50 DT'],
  ['Eau 0,5 L', '1 DT'], ['Eau 1 L', '2 DT'], ['Canette', '2,50 DT'],
  ['Citronnade', '2,50 DT'], ['Citron Amande', '3,50 DT'], ['Orange', '2 DT'], ['Fraise', '4 DT'],
  ['Croissant', '1,70 DT'], ['Cake', '2 DT'], ['Brownies', '2 DT'], ['Cookies', '1,50 DT'],
  ['Chicha au choix', '6 DT'], ['Chicha Menthe', '5 DT'],
];
let priceErrors = [];
for (const [name, price] of expected) {
  const card = page.locator('#menu article').filter({ has: page.getByRole('heading', { name, exact: true, level: 4 }) });
  const text = (await card.first().innerText().catch(() => '')).replace(/\u202f|\u00a0/g, ' ');
  if (!text.includes(price)) priceErrors.push(`${name} attendu ${price} — vu « ${text.replace(/\n/g, ' | ')} »`);
}
check('Les 23 prix sont corrects', priceErrors.length === 0, priceErrors.join(' ;; '));

/* --- Filtre par catégorie --- */
await page.getByRole('tab', { name: /Thé/ }).click();
await page.waitForTimeout(400);
const teaCards = await page.locator('#menu article').count();
check('Filtre catégorie Thé → 4 produits', teaCards === 4, `${teaCards}`);

/* --- Recherche (sans accent) --- */
await page.getByRole('tab', { name: 'Tout' }).click();
await page.getByLabel('Rechercher un produit dans le menu').fill('the amande');
await page.waitForTimeout(400);
const searchCards = await page.locator('#menu article').count();
check('Recherche « the amande » → 1 produit', searchCards === 1, `${searchCards}`);
await page.getByRole('button', { name: 'Effacer la recherche' }).click();
await page.waitForTimeout(300);

/* --- Recherche sans résultat --- */
await page.getByLabel('Rechercher un produit dans le menu').fill('pizza');
await page.waitForTimeout(400);
check('Recherche sans résultat gérée', await page.getByText(/Aucun produit ne correspond/).isVisible());
await page.getByRole('button', { name: 'Voir tout le menu' }).click();
await page.waitForTimeout(300);

/* --- Ajout au panier --- */
await page.getByRole('button', { name: /Ajouter Express au panier/ }).click();
await page.waitForTimeout(300);
check('Notification d’ajout', await page.getByText('Express ajouté au panier').isVisible());
await page.screenshot({ path: `${OUT}/04-mobile-toast.png` });

await page.getByRole('button', { name: 'Ajouter une unité de Express' }).click();
await page.getByRole('button', { name: /Ajouter Citronnade au panier/ }).click();
await page.getByRole('button', { name: /Ajouter Croissant au panier/ }).click();
await page.getByRole('button', { name: 'Ajouter une unité de Croissant' }).click();
await page.waitForTimeout(500);

/* --- Barre panier flottante --- */
const fab = page.getByRole('button', { name: /Ouvrir le panier : 5 articles/ });
check('Barre panier flottante (5 articles)', await fab.isVisible());
const fabText = await fab.innerText();
check('Total dans la barre = 9,90 DT', fabText.replace(/\u202f|\u00a0/g, ' ').includes('9,90 DT'), fabText.replace(/\n/g, ' | '));
await page.screenshot({ path: `${OUT}/05-mobile-fab.png` });

/* --- Persistance après rechargement --- */
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(800);
check('Panier conservé après rechargement', await page.getByRole('button', { name: /Ouvrir le panier : 5 articles/ }).isVisible());

/* --- Panneau panier --- */
await page.getByRole('button', { name: /Ouvrir le panier : 5 articles/ }).click();
await page.waitForTimeout(500);
const drawer = page.getByRole('dialog', { name: 'Votre panier' });
check('Panneau panier ouvert', await drawer.isVisible());
const drawerText = (await drawer.innerText()).replace(/\u202f|\u00a0/g, ' ');
check('Sous-total Express x2 = 4 DT', drawerText.includes('4 DT'), '');
check('Total panier = 9,90 DT', drawerText.includes('9,90 DT'), '');
await page.screenshot({ path: `${OUT}/06-mobile-panier.png` });

/* --- Modification des quantités --- */
await drawer.getByRole('button', { name: 'Diminuer la quantité de Express' }).click();
await page.waitForTimeout(300);
check('Décrémenter → total 7,90 DT', (await drawer.innerText()).replace(/\u202f|\u00a0/g, ' ').includes('7,90 DT'));
await drawer.getByRole('button', { name: 'Augmenter la quantité de Express' }).click();
await page.waitForTimeout(300);
check('Incrémenter → total 9,90 DT', (await drawer.innerText()).replace(/\u202f|\u00a0/g, ' ').includes('9,90 DT'));
await drawer.getByRole('button', { name: 'Supprimer Croissant du panier' }).click();
await page.waitForTimeout(300);
check('Supprimer une ligne → total 6,50 DT', (await drawer.innerText()).replace(/\u202f|\u00a0/g, ' ').includes('6,50 DT'));

/* --- Formulaire de commande --- */
await drawer.getByRole('button', { name: 'Finaliser ma commande' }).click();
await page.waitForTimeout(500);
const checkout = page.getByRole('dialog', { name: 'Finaliser ma commande' });
check('Formulaire de commande affiché', await checkout.getByLabel('Votre nom').isVisible());
await page.screenshot({ path: `${OUT}/07-mobile-commande.png` });

/* --- Validation : formulaire vide --- */
await checkout.getByRole('button', { name: /Envoyer la commande sur WhatsApp/ }).click();
await page.waitForTimeout(400);
check('Erreur si nom vide', await checkout.getByText('Merci d’indiquer votre nom.').isVisible());
check('Erreur si téléphone vide', await checkout.getByText('Merci d’indiquer votre téléphone.').isVisible());
await page.screenshot({ path: `${OUT}/08-mobile-erreurs.png` });

/* --- Validation : téléphone invalide --- */
await checkout.getByLabel('Votre nom').fill('Sami');
await checkout.getByLabel('Téléphone').fill('123');
await page.waitForTimeout(300);
check('Erreur si téléphone invalide', await checkout.getByText(/Numéro invalide/).isVisible());

/* --- Sur place → champ table obligatoire --- */
await checkout.getByLabel('Téléphone').fill('22 123 456');
await checkout.getByRole('radio', { name: /Sur place/ }).check({ force: true });
await page.waitForTimeout(300);
check('Champ « Numéro de table » affiché en sur place', await checkout.getByLabel('Numéro de table').isVisible());
await checkout.getByRole('button', { name: /Envoyer la commande sur WhatsApp/ }).click();
await page.waitForTimeout(400);
check('Erreur si table vide', await checkout.getByText('Indiquez votre numéro de table.').isVisible());

/* --- À emporter → champ table masqué --- */
await checkout.getByRole('radio', { name: /emporter/ }).check({ force: true });
await page.waitForTimeout(300);
check('Champ table masqué en à emporter', (await checkout.getByLabel('Numéro de table').count()) === 0);

/* --- Envoi complet --- */
await checkout.getByLabel('Commentaire').fill('Sans sucre');
await checkout.getByRole('button', { name: /Envoyer la commande sur WhatsApp/ }).click();
await page.waitForTimeout(600);
const message = await page.locator('pre').innerText();
console.log('\n----- MESSAGE WHATSAPP GÉNÉRÉ -----\n' + message + '\n-----------------------------------\n');
const m = message.replace(/\u202f|\u00a0/g, ' ');
check('Message : en-tête', m.startsWith('Bonjour Caffè Del Mattino 👋'));
check('Message : ligne Express x2', m.includes('☕ Express x2 : 4 DT'));
check('Message : ligne Citronnade x1', m.includes('🥤 Citronnade x1 : 2,50 DT'));
check('Message : total', m.includes('Total : 6,50 DT'));
check('Message : nom', m.includes('Nom : Sami'));
check('Message : téléphone', m.includes('Téléphone : 22 123 456'));
check('Message : type de commande', m.includes('Commande : À emporter'));
check('Message : commentaire', m.includes('Commentaire :\nSans sucre'));
check('Avertissement numéro WhatsApp non configuré', await page.getByText(/n’est pas encore configuré/).isVisible());
await page.screenshot({ path: `${OUT}/09-mobile-message.png` });

/* --- Vider le panier --- */
await page.getByRole('button', { name: 'Terminer et vider le panier' }).click();
await page.waitForTimeout(600);
check('Panier vidé → barre flottante retirée du clavier',
  await page.locator('div:has(> button[aria-label^="Ouvrir le panier :"])').first().evaluate((el) => el.hasAttribute('inert')));
await page.getByRole('button', { name: 'Ouvrir le panier (vide)' }).click();
await page.waitForTimeout(500);
check('État panier vide affiché', await page.getByText('Votre panier est vide').isVisible());
await page.screenshot({ path: `${OUT}/10-mobile-panier-vide.png` });
await page.keyboard.press('Escape');
await page.waitForTimeout(400);
check('Échap ferme le panier', await page.locator('aside[role="dialog"]').evaluate((el) => el.hasAttribute('inert') && el.className.includes('translate-x-full')));

/* --- Galerie / visionneuse --- */
await page.locator('#galerie').scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/11-mobile-galerie.png` });
await page.getByRole('button', { name: /Agrandir la photo : Notre façade/ }).click();
await page.waitForTimeout(600);
check('Visionneuse ouverte', await page.getByRole('dialog', { name: 'Notre façade' }).isVisible());
await page.screenshot({ path: `${OUT}/12-mobile-visionneuse.png` });
await page.getByRole('button', { name: 'Suivante →' }).click();
await page.waitForTimeout(400);
check('Navigation dans la visionneuse', await page.getByRole('dialog', { name: 'La salle' }).isVisible());
await page.keyboard.press('Escape');
await page.waitForTimeout(400);

/* --- Contact --- */
await page.locator('#contact').scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
check('Placeholder de carte affiché', await page.getByText('Localisation du café').isVisible());
check('Mentions « À compléter » présentes', (await page.getByText('À compléter').count()) > 0);
await page.screenshot({ path: `${OUT}/13-mobile-contact.png` });

/* --- Page entière mobile --- */
await page.screenshot({ path: `${OUT}/14-mobile-full.png`, fullPage: true });

check('Aucune erreur console', errors.length === 0, errors.slice(0, 3).join(' | '));
await mobile.close();

/* ------------------------------------------------------- AUTRES LARGEURS */
for (const [w, h, label] of [[360, 780, 'petit'], [430, 932, 'grand'], [768, 1024, 'tablette'], [1440, 900, 'bureau']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  const o = await p.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
  check(`Aucun débordement horizontal (${w}px, ${label})`, o.s <= o.c + 1, `scroll=${o.s} client=${o.c}`);
  await p.screenshot({ path: `${OUT}/20-${w}-hero.png` });
  await p.locator('#menu').scrollIntoViewIfNeeded();
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${OUT}/21-${w}-menu.png` });
  if (w >= 1024) {
    await p.getByRole('button', { name: /Ajouter Express au panier/ }).click();
    await p.waitForTimeout(300);
    await p.getByRole('button', { name: /Ouvrir le panier, 1 article/ }).click();
    await p.waitForTimeout(500);
    check('Panier ouvert depuis le header (bureau)', await p.getByRole('dialog', { name: 'Votre panier' }).isVisible());
    await p.screenshot({ path: `${OUT}/22-${w}-panier.png` });
    await p.keyboard.press('Escape');
    await p.waitForTimeout(300);
    await p.locator('#a-propos').scrollIntoViewIfNeeded();
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${OUT}/23-${w}-apropos.png` });
    await p.locator('#galerie').scrollIntoViewIfNeeded();
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${OUT}/24-${w}-galerie.png` });
    await p.locator('#contact').scrollIntoViewIfNeeded();
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${OUT}/25-${w}-contact.png` });
  }
  await ctx.close();
}

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n=== ${results.length - failed.length}/${results.length} tests réussis ===`);
if (failed.length) {
  console.log('ÉCHECS :');
  failed.forEach((f) => console.log(` - ${f.name} :: ${f.detail}`));
  process.exit(1);
}
