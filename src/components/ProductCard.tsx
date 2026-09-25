import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { MinusIcon, PlusIcon } from './ui/Icons';

export function ProductCard({ product }: { product: Product }) {
  const { lines, add, increment, decrement } = useCart();
  const quantity = lines.find((l) => l.product.id === product.id)?.quantity ?? 0;
  const inCart = quantity > 0;

  return (
    <article
      className={[
        'group relative flex gap-4 rounded-2xl border bg-white p-4 transition-all duration-200 sm:p-5',
        inCart
          ? 'border-forest-500/45 shadow-soft ring-1 ring-forest-500/15'
          : 'border-cream-300/70 hover:border-wood-300 hover:shadow-soft',
      ].join(' ')}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h4 className="font-display text-lg leading-snug font-semibold text-forest-900">
            {product.name}
          </h4>
          {product.popular && (
            <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide text-gold-600 uppercase">
              Populaire
            </span>
          )}
        </div>

        {product.description && (
          <p className="mt-1.5 text-sm leading-relaxed text-forest-800/65">{product.description}</p>
        )}

        {product.needsConfirmation && (
          <p className="mt-1.5 text-xs text-wood-600/80">
            <span aria-hidden="true">*</span> Prix à confirmer auprès du café
          </p>
        )}

        <p className="mt-2.5 font-semibold text-wood-600">{formatPrice(product.price)}</p>
      </div>

      {/* Commande : un simple « + » tant que le produit n'est pas au panier,
          puis un sélecteur de quantité pour ajuster sans ouvrir le panier. */}
      <div className="flex shrink-0 items-start">
        {inCart ? (
          <div className="flex items-center gap-1 rounded-full border border-forest-500/35 bg-forest-50 p-1">
            <button
              type="button"
              onClick={() => decrement(product.id)}
              className="grid size-8 place-items-center rounded-full text-forest-800 transition-colors hover:bg-forest-100 active:bg-forest-200"
              aria-label={
                quantity === 1
                  ? `Retirer ${product.name} du panier`
                  : `Retirer une unité de ${product.name}`
              }
            >
              <MinusIcon className="size-4" />
            </button>
            <span
              className="min-w-6 text-center text-sm font-bold text-forest-900 tabular-nums"
              aria-label={`Quantité : ${quantity}`}
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => increment(product.id)}
              className="grid size-8 place-items-center rounded-full bg-forest-700 text-cream-50 transition-colors hover:bg-forest-600"
              aria-label={`Ajouter une unité de ${product.name}`}
            >
              <PlusIcon className="size-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => add(product)}
            className="grid size-11 place-items-center rounded-full border border-forest-700/20 bg-forest-800 text-cream-50 shadow-soft transition-all hover:scale-105 hover:bg-forest-700 active:scale-95"
            aria-label={`Ajouter ${product.name} au panier, ${formatPrice(product.price)}`}
          >
            <PlusIcon className="size-5" />
          </button>
        )}
      </div>
    </article>
  );
}
