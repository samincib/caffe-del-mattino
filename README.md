# Caffè Del Mattino — site web

**🌍 Site en ligne : https://samincib.github.io/caffe-del-mattino/**

Site vitrine et commande en ligne pour la cafétéria **Caffè Del Mattino**.
Le client consulte la carte, remplit son panier et envoie sa commande **par WhatsApp**.
Aucun paiement en ligne, aucun serveur à payer : le site est 100 % statique.

---

## 1. Démarrer en local

Il faut [Node.js](https://nodejs.org) version 20 ou plus.

```bash
npm install     # installe les dépendances (une seule fois)
npm run dev     # démarre le site sur http://localhost:5173
```

Autres commandes :

| Commande          | Rôle                                                       |
| ----------------- | ---------------------------------------------------------- |
| `npm run dev`     | Serveur de développement, rechargement automatique          |
| `npm run build`   | Génère le site final dans `dist/`                           |
| `npm run preview` | Teste le site final en local (http://localhost:4173)        |
| `npm run images`  | Recalcule les images optimisées à partir de `assets-source/` |
| `npm run lint`    | Vérifie les types TypeScript                                |
| `npm run test`    | Parcours de commande automatisé dans un vrai navigateur     |

---

## 2. À compléter avant la mise en ligne

Tout se trouve dans **`src/config/cafe.ts`**.

Les valeurs encore marquées `TODO` s'affichent sur le site sous la forme
« À compléter » et les liens correspondants sont automatiquement désactivés.
**Aucune information n'a été inventée.**

### a. Le numéro WhatsApp (le plus important)

```ts
// src/config/cafe.ts
export const WHATSAPP_NUMBER = '21622123456';
```

Format : indicatif international **sans `+`, sans espaces**.
Pour le numéro `+216 22 123 456`, on écrit `21622123456`.

> Tant que ce numéro n'est pas renseigné, le bouton « Envoyer la commande »
> affiche le message tout prêt avec un bouton « Copier », au lieu d'ouvrir WhatsApp.
> Le site reste donc utilisable pour une démonstration.

### b. Les autres informations

Dans le même fichier :

```ts
phone: '+216 22 123 456',
address: { street: '…', city: '…', postalCode: '…' },
hours: [{ day: 'Lundi', value: '07:00 – 22:00' }, …],
social: { instagram: 'https://instagram.com/…', facebook: 'https://facebook.com/…' },
mapsUrl: '…',        // lien « Partager » de Google Maps
mapsEmbedUrl: '…',   // lien « Intégrer une carte » de Google Maps
seo: { siteUrl: 'https://…' },   // déjà renseigné avec l'URL GitHub Pages
```

**Pour la carte Google Maps :** ouvrir Google Maps → chercher le café →
**Partager** → onglet **Intégrer une carte** → copier **uniquement** ce qui se
trouve entre les guillemets de `src="..."` et le coller dans `mapsEmbedUrl`.

---

## 3. Modifier le menu et les prix

Tout se trouve dans **`src/data/menu.ts`**. C'est le seul fichier à toucher.

### Changer un prix

```ts
{ id: 'cafe-express', name: 'Express', price: 2, categoryId: 'cafe' },
//                                     ^^^^^^^^ en dinars : 2.5 = 2,500 DT
```

### Ajouter un produit

Copier une ligne existante, changer `id` (il doit rester unique), `name` et `price` :

```ts
{ id: 'cafe-noisette', name: 'Noisette', price: 2.4, categoryId: 'cafe' },
```

### Supprimer un produit

Supprimer sa ligne. S'il se trouvait déjà dans le panier d'un client,
il en est retiré automatiquement.

### Options disponibles sur un produit

| Champ                | Effet                                                  |
| -------------------- | ------------------------------------------------------ |
| `description`        | Texte affiché sous le nom                              |
| `popular: true`      | Ajoute le badge « Populaire »                          |
| `needsConfirmation`  | Ajoute « Prix à confirmer auprès du café »             |

### Ajouter une catégorie

1. Ajouter son identifiant dans `src/types/index.ts` (`CategoryId`).
2. Ajouter l'entrée dans le tableau `categories` de `src/data/menu.ts`.
3. Mettre `image: null` si vous n'avez pas de photo (une vignette colorée
   avec l'emoji sera utilisée).

---

## 4. Remplacer ou ajouter des photos

Les images ne sont **pas** utilisées brutes : un script les recadre, les
étalonne (rendu chaud, cohérent sur tout le site) et génère des versions
WebP + JPEG en plusieurs largeurs pour que le site reste rapide sur mobile.

```
assets-source/          ← vos photos d'origine (jamais publiées telles quelles)
  cafe/                 ← les photos prises au café
  web/                  ← les images d'illustration
public/images/          ← les fichiers générés, utilisés par le site
```

### Remplacer une photo existante

1. Déposer la nouvelle photo dans `assets-source/cafe/` **en gardant le même nom**.
2. Lancer :

```bash
npm run images
```

### Ajuster un cadrage

Dans `scripts/optimize-images.mjs`, chaque image a une recette :

```js
{
  src: 'cafe/facade-originale.jpg',
  name: 'facade-hero',
  grade: 'cafe',
  crop: { x: 0.02, y: 0.25, w: 0.61, h: 0.55 }, // en proportions de 0 à 1
  widths: [640, 1280, 1920],
}
```

`crop` est exprimé en **proportions** de l'image : `x: 0.02` = on commence à 2 %
depuis la gauche, `w: 0.61` = on garde 61 % de la largeur. Cela permet de
changer de photo sans tout recalculer. Relancer `npm run images` après
chaque modification.

### Images d'illustration

Trois vues de la galerie et les vignettes de catégories sont des photos
libres de droits (Unsplash, usage commercial autorisé). Elles sont signalées
sous la galerie. **À remplacer par vos propres photos dès que possible** :
déposez-les dans `assets-source/web/` sous le même nom et relancez `npm run images`.

### ⚠️ Photos de personnes

La photo d'origine de la façade montre des clients dont le visage est
reconnaissable. Les cadrages livrés les excluent volontairement : sur un site
commercial, publier une personne identifiable demande son accord. Si vous avez
cet accord, élargissez le `crop` de `facade-hero` (mettre `w: 0.96`).

---

## 5. Mettre le site en ligne gratuitement

### Option A — GitHub Pages (déjà en place ✅)

Le site est **déjà déployé** ici :

> **https://samincib.github.io/caffe-del-mattino/**

Tout est automatisé par le fichier `.github/workflows/deploy.yml` :
à **chaque `git push` sur `main`**, GitHub reconstruit le site et le remet
en ligne tout seul, en une minute environ.

```bash
git add .
git commit -m "Mise à jour du menu"
git push
```

Suivre l'avancement : onglet **Actions** du dépôt
(https://github.com/samincib/caffe-del-mattino/actions).

GitHub Pages est gratuit, sans limite de trafic pour un site de cette taille,
et entièrement basé sur des outils libres.

> **Note technique :** sur GitHub Pages le site vit dans un sous-dossier
> (`/caffe-del-mattino/`). Le workflow passe donc `VITE_BASE` à la
> construction, et tous les liens vers les images et les scripts sont
> préfixés automatiquement. En local, `npm run dev` continue de servir le
> site à la racine, sans rien changer.

### Option B — Vercel (si vous préférez, ou pour un nom de domaine)

Gratuit, adresse permanente, mise à jour automatique à chaque modification.

1. **Créer un dépôt GitHub**

   ```bash
   git init
   git add .
   git commit -m "Site Caffè Del Mattino"
   git branch -M main
   git remote add origin https://github.com/VOTRE-COMPTE/caffe-del-mattino.git
   git push -u origin main
   ```

2. Aller sur **https://vercel.com** et se connecter avec GitHub.
3. **Add New… → Project**, puis sélectionner le dépôt `caffe-del-mattino`.
4. Vercel détecte Vite tout seul. Ne rien changer :
   - Framework : `Vite`
   - Build Command : `npm run build`
   - Output Directory : `dist`
5. Cliquer sur **Deploy**, patienter environ une minute.
6. Vous obtenez une adresse du type `https://caffe-del-mattino.vercel.app`.

Ensuite, **chaque `git push` met le site à jour automatiquement.**

7. Reporter l'adresse obtenue dans `src/config/cafe.ts` :

   ```ts
   seo: { siteUrl: 'https://caffe-del-mattino.vercel.app' }
   ```

   puis `git add . && git commit -m "URL du site" && git push`.

### Nom de domaine

Pour une adresse du type `caffedelmattino.tn` :

- **avec GitHub Pages** : dépôt → **Settings → Pages → Custom domain**,
  puis ajouter un enregistrement `CNAME` chez votre registrar vers
  `samincib.github.io`. Le HTTPS est automatique et gratuit.
  Le site passe alors à la racine du domaine : retirer `VITE_BASE`
  du workflow (`.github/workflows/deploy.yml`).
- **avec Vercel** : **Settings → Domains**, HTTPS automatique également.

### Variables d'environnement

Aucune. Toute la configuration est dans `src/config/cafe.ts`, il n'y a ni
base de données ni clé d'API.

---

## 6. Comment fonctionne la commande

1. Le client ajoute des produits : le panier est conservé dans son navigateur
   (`localStorage`), il survit à un rafraîchissement de page.
2. Il remplit son nom, son téléphone, le type de commande (sur place avec
   numéro de table, ou à emporter) et un commentaire éventuel.
3. Le site compose un message et ouvre WhatsApp avec ce message prérempli :

```
Bonjour Caffè Del Mattino 👋

Je souhaite passer la commande suivante :

☕ Express x2 : 4 DT
🥤 Citronnade x1 : 2,50 DT

Total : 6,50 DT

Nom : Sami
Téléphone : 22 123 456
Commande : À emporter

Commentaire :
Sans sucre

Merci !
```

4. Le client appuie sur « Envoyer ». Le café reçoit la commande sur WhatsApp
   et encaisse sur place.

> Les prix ne sont **jamais** conservés dans le navigateur du client : seuls
> l'identifiant du produit et la quantité le sont. Si vous changez un tarif,
> il s'applique immédiatement, même pour un panier ouvert la veille.

---

## 7. Organisation du projet

```
assets-source/            Photos d'origine (non publiées telles quelles)
public/
  images/                 Images générées par npm run images
  favicon.svg             Icône du site
  site.webmanifest        Installation sur écran d'accueil
scripts/
  optimize-images.mjs     Recadrage + étalonnage + compression
src/
  config/cafe.ts          ★ Coordonnées, horaires, WhatsApp, SEO
  data/menu.ts            ★ Produits et prix
  types/index.ts          Types TypeScript
  context/
    CartContext.tsx       État du panier
    ToastContext.tsx      Notifications
  utils/
    cart.ts               Calculs et sauvegarde du panier
    whatsapp.ts           Composition du message WhatsApp
    format.ts             Affichage des prix en dinars
    search.ts             Recherche sans accents
  components/
    Header, Hero, Highlights, About, MenuSection, ProductCard,
    Gallery, Contact, Footer, CartDrawer, CheckoutForm,
    FloatingBar, StructuredData
    ui/                   SmartImage (images responsives), Icons
  App.tsx, main.tsx, index.css
```

★ = les deux fichiers à modifier au quotidien.

---

## 8. Tests automatisés

`npm run test` pilote un vrai navigateur Chrome et rejoue tout le parcours
client : affichage des 23 prix, filtres, recherche, ajout au panier,
modification des quantités, persistance après rechargement, validation du
formulaire, message WhatsApp généré, galerie, et absence de débordement
horizontal en 360 / 390 / 430 / 768 / 1440 px.

```bash
npm run preview          # dans un terminal
npm run test             # dans un autre

# ou directement contre le site en ligne :
TARGET=https://samincib.github.io/caffe-del-mattino/ npm run test
```

Les captures d'écran sont déposées dans `test-results/`.
Si Chrome n'est pas à l'emplacement habituel, indiquer son chemin :
`CHROME_PATH="/chemin/vers/chrome" npm run test`.

---

## 9. Technologies

React 19 · TypeScript · Vite 7 · Tailwind CSS 4 · sharp (traitement des images)

Pas de backend, pas de base de données, pas d'abonnement.

---

## 10. Ce qu'il reste à fournir

- [ ] Numéro WhatsApp qui recevra les commandes
- [ ] Numéro de téléphone à afficher
- [ ] Adresse postale exacte
- [ ] Horaires d'ouverture (jour par jour)
- [ ] Lien Instagram
- [ ] Lien Facebook
- [ ] Lien Google Maps (partage + intégration)
- [ ] **Confirmation du prix du « Petit déjeuner »** : l'ardoise indique `5d`,
      la valeur retenue dans le site est `9 DT` (celle qui nous a été transmise).
      À corriger dans `src/data/menu.ts` si besoin.
- [ ] Vos propres photos pour remplacer les images d'illustration
