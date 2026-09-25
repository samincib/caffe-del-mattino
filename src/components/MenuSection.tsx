import { useMemo, useState } from 'react';
import type { CategoryId, Product } from '../types';
import { categories, products } from '../data/menu';
import { matches } from '../utils/search';
import { ProductCard } from './ProductCard';
import { SmartImage } from './ui/SmartImage';
import { CloseIcon, SearchIcon } from './ui/Icons';

type Filter = CategoryId | 'tout';

export function MenuSection() {
  const [filter, setFilter] = useState<Filter>('tout');
  const [query, setQuery] = useState('');

  /** Produits retenus après recherche, regroupés par catégorie. */
  const groups = useMemo(() => {
    const visibleCategories =
      filter === 'tout' ? categories : categories.filter((c) => c.id === filter);

    return visibleCategories
      .map((category) => ({
        category,
        items: products.filter(
          (p: Product) =>
            p.categoryId === category.id && matches(query, p.name, p.description),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [filter, query]);

  const resultCount = groups.reduce((sum, g) => sum + g.items.length, 0);
  const isSearching = query.trim().length > 0;

  return (
    <section id="menu" className="relative scroll-mt-20 bg-cream-50 py-16 md:py-24">
      <div className="container-page">
        {/* En-tête de section */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-[0.7rem] tracking-[0.25em] text-gold-600 uppercase">
            La carte
          </span>
          <h2 className="font-display text-3xl text-forest-900 sm:text-4xl lg:text-[2.75rem]">
            Notre menu
          </h2>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-forest-800/70">
            Choisissez vos produits, ajoutez-les au panier, puis envoyez votre commande sur WhatsApp.
            Prix en dinars tunisiens.
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="mx-auto mt-9 max-w-md">
          <label htmlFor="recherche-menu" className="sr-only">
            Rechercher un produit dans le menu
          </label>
          <div className="relative">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-forest-800/40"
            />
            <input
              id="recherche-menu"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher : express, croissant, citronnade…"
              autoComplete="off"
              className="w-full rounded-full border border-cream-300 bg-white py-3.5 pr-11 pl-12 text-[0.95rem] text-forest-900 shadow-soft transition-colors placeholder:text-forest-800/35 focus:border-forest-500 focus:outline-none"
            />
            {isSearching && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full text-forest-800/50 transition-colors hover:bg-cream-200 hover:text-forest-900"
                aria-label="Effacer la recherche"
              >
                <CloseIcon className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Onglets de catégories — défilement horizontal sur mobile,
            collés sous le header pour rester accessibles pendant le scroll. */}
        <div className="sticky top-16 z-30 -mx-5 mt-6 bg-cream-50/92 px-5 py-3 backdrop-blur-md md:top-20 md:-mx-8 md:px-8">
          <div
            className="no-scrollbar flex gap-2 overflow-x-auto pb-0.5"
            role="tablist"
            aria-label="Catégories du menu"
          >
            <CategoryChip
              label="Tout"
              emoji="✨"
              active={filter === 'tout'}
              onClick={() => setFilter('tout')}
            />
            {categories.map((category) => (
              <CategoryChip
                key={category.id}
                label={category.name}
                emoji={category.emoji}
                active={filter === category.id}
                onClick={() => setFilter(category.id)}
              />
            ))}
          </div>
        </div>

        {/* Résultats */}
        {resultCount === 0 ? (
          <p className="mt-16 text-center text-forest-800/60">
            Aucun produit ne correspond à «&nbsp;{query.trim()}&nbsp;».{' '}
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setFilter('tout');
              }}
              className="font-semibold text-forest-700 underline underline-offset-4"
            >
              Voir tout le menu
            </button>
          </p>
        ) : (
          <div className="mt-10 space-y-14 md:space-y-16">
            {groups.map(({ category, items }) => (
              <div key={category.id} className="scroll-mt-36">
                {/* Bandeau de catégorie */}
                <div className="mb-6 flex items-center gap-4">
                  {category.image ? (
                    <SmartImage
                      name={category.image}
                      widths={[400, 800]}
                      alt=""
                      sizes="72px"
                      wrapperClassName="shrink-0"
                      className="size-16 rounded-2xl object-cover shadow-soft sm:size-[4.5rem]"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-forest-700 to-forest-900 text-2xl shadow-soft sm:size-[4.5rem]"
                    >
                      {category.emoji}
                    </span>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-display text-2xl text-forest-900 sm:text-[1.7rem]">
                      {category.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-forest-800/60">{category.blurb}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="ml-auto hidden h-px flex-1 bg-gradient-to-r from-cream-300 to-transparent sm:block"
                  />
                </div>

                {/* Produits */}
                <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Note honnête sur l'information incertaine */}
        <p className="mt-14 rounded-2xl border border-cream-300 bg-cream-100 px-5 py-4 text-center text-sm leading-relaxed text-forest-800/70">
          Les prix sont ceux relevés sur l’ardoise du café et peuvent évoluer. En cas de doute,
          n’hésitez pas à nous le demander lors de votre commande.
        </p>
      </div>
    </section>
  );
}

interface ChipProps {
  label: string;
  emoji: string;
  active: boolean;
  onClick: () => void;
}

function CategoryChip({ label, emoji, active, onClick }: ChipProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        'flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all',
        active
          ? 'border-forest-800 bg-forest-800 text-cream-50 shadow-soft'
          : 'border-cream-300 bg-white text-forest-800/80 hover:border-wood-300 hover:text-forest-900',
      ].join(' ')}
    >
      <span aria-hidden="true">{emoji}</span>
      {label}
    </button>
  );
}
