import { useCallback, useState } from 'react';
import { asset } from '../../utils/asset';

interface SmartImageProps {
  /** Nom de base du fichier dans `public/images/`, sans largeur ni extension. */
  name: string;
  /** Largeurs générées par `npm run images` pour cette image. */
  widths: number[];
  alt: string;
  sizes?: string;
  className?: string;
  /** Classe appliquée au conteneur `<picture>`. */
  wrapperClassName?: string;
  /** `true` pour l'image du hero : chargement prioritaire, sans fondu. */
  priority?: boolean;
}

/**
 * Image responsive : WebP d'abord, JPEG en repli, `srcset` sur les largeurs
 * réellement générées, chargement différé et fondu à l'arrivée.
 */
export function SmartImage({
  name,
  widths,
  alt,
  sizes = '100vw',
  className = '',
  wrapperClassName = '',
  priority = false,
}: SmartImageProps) {
  // Les images prioritaires sont affichées sans fondu : c'est en général
  // l'élément LCP de la page, on ne retarde pas son apparition.
  const [loaded, setLoaded] = useState(priority);

  /**
   * Une image déjà en cache peut terminer son chargement avant que React
   * n'attache `onLoad` : l'événement ne se déclencherait jamais et l'image
   * resterait transparente. On teste donc `complete` dès que le noeud existe.
   */
  const ref = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) setLoaded(true);
  }, []);

  const srcSet = (ext: string) =>
    widths.map((w) => `${asset(`/images/${name}-${w}.${ext}`)} ${w}w`).join(', ');
  const largest = widths[widths.length - 1];

  return (
    <picture className={wrapperClassName}>
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img
        ref={ref}
        src={asset(`/images/${name}-${largest}.jpg`)}
        srcSet={srcSet('jpg')}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`${className} transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </picture>
  );
}
