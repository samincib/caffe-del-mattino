import { asset } from '../utils/asset';

const ITEMS = [
  {
    emoji: '☕',
    title: 'Café',
    text: 'Un moment café dans une ambiance conviviale.',
    href: '#menu',
  },
  {
    emoji: '🥐',
    title: 'Petit déjeuner',
    text: 'Commencez votre journée avec un petit déjeuner gourmand.',
    href: '#menu',
  },
  {
    emoji: '🥤',
    title: 'Jus frais',
    text: 'Citronnade, orange, fraise et autres boissons fraîches.',
    href: '#menu',
  },
  {
    emoji: '🍰',
    title: 'Pâtisserie',
    text: 'Une sélection de douceurs pour accompagner votre café.',
    href: '#menu',
  },
];

export function Highlights() {
  return (
    <section
      aria-label="Nos spécialités"
      className="relative overflow-hidden border-y border-cream-300/60 bg-cream-100"
    >
      {/* Texture de feuillage reprise du mur du café, très atténuée */}
      <div
        aria-hidden="true"
        style={{ backgroundImage: `url(${asset('/images/texture-vegetale-640.jpg')})` }}
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.07]"
      />

      <div className="container-page relative py-16 md:py-20">
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="group flex flex-col items-start rounded-2xl p-1 transition-transform hover:-translate-y-1"
            >
              <span
                aria-hidden="true"
                className="mb-4 grid size-14 place-items-center rounded-2xl border border-cream-300 bg-cream-50 text-2xl shadow-soft transition-colors group-hover:border-gold-400/60"
              >
                {item.emoji}
              </span>
              <h3 className="font-display text-xl text-forest-900">{item.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-forest-800/70">{item.text}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
