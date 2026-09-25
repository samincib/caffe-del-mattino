import { useCallback, useEffect, useState } from 'react';
import { SmartImage } from './ui/SmartImage';
import { CloseIcon } from './ui/Icons';

interface Shot {
  name: string;
  widths: number[];
  alt: string;
  caption: string;
  /** `false` = photo d'illustration, signalée comme telle sous la galerie. */
  real: boolean;
  /** Classes de placement dans la grille en mosaïque (écrans larges). */
  span?: string;
}

/**
 * Les cinq premières vues proviennent des photos du café.
 * Les suivantes sont des images d'illustration libres de droits, à remplacer
 * par de vraies photos dès qu'elles sont disponibles (voir README).
 */
const SHOTS: Shot[] = [
  {
    name: 'facade-hero',
    widths: [640, 1280, 1920],
    alt: 'La façade du Caffè Del Mattino avec son enseigne et son store',
    caption: 'Notre façade',
    real: true,
    span: 'sm:col-span-2 sm:row-span-2',
  },
  {
    name: 'salle',
    widths: [640, 1280],
    alt: 'La salle : mur de verdure, table et chaises claires',
    caption: 'La salle',
    real: true,
  },
  {
    name: 'menu-tableau',
    widths: [480, 960],
    alt: 'L’ardoise en bois du café avec les prix',
    caption: 'Notre ardoise',
    real: true,
  },
  {
    name: 'pancarte-petit-dejeuner',
    widths: [400, 800],
    alt: 'La pancarte en bois annonçant les formules petit déjeuner',
    caption: 'Nos formules',
    real: true,
  },
  {
    name: 'facade-terrasse',
    widths: [480, 960],
    alt: 'La terrasse du café avec ses mange-debout',
    caption: 'La terrasse',
    real: true,
  },
  {
    name: 'ambiance-tasses',
    widths: [480, 960],
    alt: 'Cappuccinos servis à côté de plantes vertes',
    caption: 'Le café du matin',
    real: false,
  },
  {
    name: 'ambiance-jus',
    widths: [400, 800],
    alt: 'Un verre de jus d’orange fraîchement pressé',
    caption: 'Jus pressés',
    real: false,
  },
  {
    name: 'ambiance-douceurs',
    widths: [480, 960],
    alt: 'Cookies au chocolat',
    caption: 'Les douceurs',
    real: false,
  },
  {
    name: 'ambiance-amis',
    widths: [480, 960],
    alt: 'Trois tasses de café réunies au-dessus d’une table',
    caption: 'Entre amis',
    real: false,
  },
];

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const move = useCallback((delta: number) => {
    setOpenIndex((current) =>
      current === null ? null : (current + delta + SHOTS.length) % SHOTS.length,
    );
  }, []);

  /* Visionneuse : navigation au clavier et page figée derrière. */
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowLeft') move(-1);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [openIndex, close, move]);

  const current = openIndex === null ? null : SHOTS[openIndex];

  return (
    <section id="galerie" className="bg-forest-950 py-20 md:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-[0.7rem] tracking-[0.25em] text-gold-400 uppercase">
            Galerie
          </span>
          <h2 className="font-display text-3xl text-cream-50 sm:text-4xl lg:text-[2.75rem]">
            L’esprit de la maison
          </h2>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-cream-200/65">
            Un mur de verdure, du bois, quelques tables au soleil.
          </p>
        </div>

        <div className="mt-12 grid auto-rows-[10rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {SHOTS.map((shot, index) => (
            <button
              key={shot.name}
              type="button"
              onClick={() => setOpenIndex(index)}
              className={[
                'group relative overflow-hidden rounded-2xl bg-forest-900 focus-visible:outline-offset-4',
                shot.span ?? '',
              ].join(' ')}
              aria-label={`Agrandir la photo : ${shot.caption}`}
            >
              <SmartImage
                name={shot.name}
                widths={shot.widths}
                alt={shot.alt}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                wrapperClassName="block size-full"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Voile + légende, révélés au survol (toujours visibles au toucher) */}
              <span className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
              <span className="absolute inset-x-0 bottom-0 p-3 text-left text-sm font-medium text-cream-50 sm:p-4">
                {shot.caption}
              </span>
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-cream-200/40">
          Les photos de la façade, de la salle et de l’ardoise ont été prises au café. Les autres
          sont des images d’illustration, à remplacer par vos propres photos.
        </p>
      </div>

      {/* Visionneuse */}
      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.caption}
          className="animate-fade-in fixed inset-0 z-[80] flex flex-col bg-forest-950/95 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
            <p className="font-display text-lg text-cream-50">{current.caption}</p>
            <button
              type="button"
              onClick={close}
              autoFocus
              className="grid size-11 place-items-center rounded-full border border-cream-100/20 text-cream-50 transition-colors hover:bg-forest-800"
              aria-label="Fermer la visionneuse"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-6">
            <SmartImage
              name={current.name}
              widths={current.widths}
              alt={current.alt}
              sizes="100vw"
              priority
              wrapperClassName="flex max-h-full items-center"
              className="max-h-[72svh] w-auto rounded-2xl object-contain shadow-lift"
            />
          </div>

          <div className="flex items-center justify-center gap-3 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={() => move(-1)}
              className="rounded-full border border-cream-100/20 px-5 py-2.5 text-sm font-medium text-cream-100 transition-colors hover:bg-forest-800"
            >
              ← Précédente
            </button>
            <span className="text-sm text-cream-200/50 tabular-nums">
              {(openIndex ?? 0) + 1} / {SHOTS.length}
            </span>
            <button
              type="button"
              onClick={() => move(1)}
              className="rounded-full border border-cream-100/20 px-5 py-2.5 text-sm font-medium text-cream-100 transition-colors hover:bg-forest-800"
            >
              Suivante →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
