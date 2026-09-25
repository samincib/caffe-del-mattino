import { SmartImage } from './ui/SmartImage';

const MOMENTS = [
  { label: 'Un café', detail: 'Express, capucin ou direct, au comptoir comme en terrasse.' },
  { label: 'Un petit déjeuner', detail: 'Une formule complète pour bien démarrer la journée.' },
  { label: 'Un jus frais', detail: 'Citronnade, orange, fraise, citron amande.' },
  { label: 'Une pâtisserie', detail: 'Croissant, cake, brownies, cookies.' },
  { label: 'Un moment', detail: 'Entre amis, autour d’une table, sans se presser.' },
];

export function About() {
  return (
    <section id="a-propos" className="grain relative overflow-hidden bg-cream-50 py-20 md:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Collage : la salle en grand, l'ardoise en médaillon */}
        <div className="relative order-2 lg:order-1">
          <div className="overflow-hidden rounded-[1.75rem] bg-forest-900 shadow-lift">
            <SmartImage
              name="salle"
              widths={[640, 1280]}
              alt="La salle du café : mur de verdure, tables et chaises en résine claire"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          {/* Médaillon ardoise — masqué sur les très petits écrans pour éviter
              qu'il ne recouvre la photo principale. */}
          <div className="absolute -right-2 -bottom-10 hidden w-36 overflow-hidden rounded-2xl border-4 border-cream-50 shadow-lift sm:block md:-right-6 md:w-44">
            <SmartImage
              name="facade-terrasse"
              widths={[480, 960]}
              alt="La terrasse du café, vue depuis la rue"
              sizes="180px"
              className="aspect-[3/4] w-full object-cover"
            />
          </div>

          {/* Pastille décorative */}
          <div
            aria-hidden="true"
            className="absolute -top-5 -left-4 hidden size-20 rounded-full border border-gold-500/25 md:block"
          />
        </div>

        {/* Texte */}
        <div className="order-1 lg:order-2">
          <span className="rule-gold mb-5" aria-hidden="true" />
          <h2 className="font-display text-3xl leading-tight text-forest-900 sm:text-4xl lg:text-[2.75rem]">
            Bienvenue chez
            <span className="mt-1 block text-wood-600">Caffè Del Mattino</span>
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-forest-800/85">
            Un mur de verdure, du bois clair, quelques tables en terrasse : notre café est fait pour
            qu’on s’y pose. Le matin pour un express avalé debout, plus tard pour un petit déjeuner
            qui s’étire, ou en fin de journée autour d’une chicha.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-forest-800/85">
            Tout est préparé à la commande, du jus pressé à la citronnade, et servi dans une ambiance
            simple et conviviale.
          </p>

          <ul className="mt-8 space-y-3.5">
            {MOMENTS.map((moment) => (
              <li key={moment.label} className="flex gap-3.5">
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-500"
                />
                <p className="text-[0.95rem] leading-relaxed text-forest-800/80">
                  <span className="font-semibold text-forest-900">{moment.label}</span>
                  <span className="text-forest-700/50"> — </span>
                  {moment.detail}
                </p>
              </li>
            ))}
          </ul>

          <a
            href="#menu"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-forest-800 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-forest-700"
          >
            Découvrir la carte
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
