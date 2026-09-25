import { cafeConfig } from '../config/cafe';
import { useCart } from '../context/CartContext';
import { SmartImage } from './ui/SmartImage';

const HIGHLIGHTS = ['Café', 'Petit déjeuner', 'Jus frais', 'Pâtisserie', 'Chicha'];

export function Hero() {
  const { open, count } = useCart();

  return (
    <section id="accueil" className="relative isolate overflow-hidden bg-forest-950">
      {/* Photo de la façade — recadrée et étalonnée par `npm run images` */}
      <div className="absolute inset-0 -z-10">
        {/* Cadrage vertical sur mobile, panoramique à partir de la tablette. */}
        <SmartImage
          name="hero-mobile"
          widths={[480, 900]}
          alt="L’intérieur du café : mur de verdure, ardoise en bois et tables"
          sizes="100vw"
          priority
          wrapperClassName="md:hidden"
          className="size-full object-cover object-center"
        />
        <SmartImage
          name="facade-hero"
          widths={[640, 1280, 1920]}
          alt="La façade du Caffè Del Mattino, son enseigne et son store"
          sizes="100vw"
          priority
          wrapperClassName="hidden md:block size-full"
          className="size-full object-cover object-center"
        />
        {/* Double voile : lisibilité du texte en bas, teinte verte de la maison. */}
        {/* Voile plus soutenu sur mobile : le texte s'y superpose a l'ardoise,
            tres chargee. Plus leger sur grand ecran, ou la photo respire. */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 from-30% via-forest-950/80 via-70% to-forest-950/25 md:from-forest-950/95 md:from-10% md:via-forest-950/55 md:via-60% md:to-forest-950/15" />
        <div className="absolute inset-0 bg-forest-900/15 mix-blend-multiply" />
      </div>

      <div className="container-page flex min-h-[86svh] flex-col justify-end pt-28 pb-14 sm:min-h-[88svh] md:min-h-[92svh] md:pb-20">
        <div className="max-w-2xl">
          <p className="animate-rise mb-5 inline-flex items-center gap-2.5 rounded-full border border-gold-400/30 bg-forest-950/40 py-1.5 pr-4 pl-2 text-[0.7rem] tracking-[0.18em] text-gold-300 uppercase backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-gold-400" aria-hidden="true" />
            Cafétéria · Tunisie
          </p>

          <h1 className="animate-rise font-display text-[2.6rem] leading-[1.05] font-semibold text-cream-50 [animation-delay:60ms] sm:text-6xl lg:text-7xl">
            {cafeConfig.name}
          </h1>

          <p className="animate-rise mt-5 max-w-lg text-lg leading-relaxed text-cream-200/90 [animation-delay:120ms] sm:text-xl">
            {cafeConfig.tagline}
          </p>

          {/* Boutons principaux — pleine largeur sur mobile pour être faciles à viser */}
          <div className="animate-rise mt-8 flex flex-col gap-3 [animation-delay:180ms] sm:flex-row sm:items-center">
            <a
              href="#menu"
              className="rounded-full bg-cream-50 px-7 py-3.5 text-center text-base font-semibold text-forest-900 shadow-lift transition-transform hover:scale-[1.02] active:scale-100"
            >
              Voir le menu
            </a>
            <button
              type="button"
              onClick={() => open(count > 0 ? 'commande' : 'panier')}
              className="rounded-full border border-cream-100/35 px-7 py-3.5 text-center text-base font-semibold text-cream-50 backdrop-blur-sm transition-colors hover:border-gold-400/70 hover:bg-forest-900/50"
            >
              Commander
            </button>
          </div>

          {/* Bandeau de spécialités */}
          <ul className="animate-rise mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-cream-200/75 [animation-delay:240ms]">
            <li aria-hidden="true" className="text-gold-300">
              ☕
            </li>
            {HIGHLIGHTS.map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden="true" className="text-cream-300/30">
                    •
                  </span>
                )}
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Liseré doré : transition vers la section suivante */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"
      />
    </section>
  );
}
