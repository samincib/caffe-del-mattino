import { useEffect } from 'react';
import { cafeConfig, isTodo } from '../config/cafe';
import { categories, products } from '../data/menu';
import { asset } from '../utils/asset';

/**
 * Données structurées `CafeOrCoffeeShop` pour les moteurs de recherche.
 *
 * Règle appliquée : seuls les champs réellement renseignés dans
 * `config/cafe.ts` sont publiés. Tant que l'adresse, les horaires ou le
 * téléphone restent des espaces réservés, ils sont simplement absents du
 * balisage — rien n'est inventé.
 */
export function StructuredData() {
  useEffect(() => {
    const { address, phone, hours, social, seo, mapsUrl } = cafeConfig;

    const postalAddress: Record<string, string> = { '@type': 'PostalAddress' };
    if (!isTodo(address.street)) postalAddress.streetAddress = address.street;
    if (!isTodo(address.city)) postalAddress.addressLocality = address.city;
    if (!isTodo(address.postalCode)) postalAddress.postalCode = address.postalCode;
    postalAddress.addressCountry = 'TN';

    const openingHours = hours
      .filter((slot) => !isTodo(slot.value) && slot.value.toLowerCase() !== 'fermé')
      .map((slot) => `${slot.day} ${slot.value}`);

    const sameAs = [social.instagram, social.facebook, social.tiktok].filter((v) => !isTodo(v));

    const data: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'CafeOrCoffeeShop',
      name: cafeConfig.name,
      description: seo.description,
      servesCuisine: ['Café', 'Petit déjeuner', 'Pâtisserie'],
      priceRange: '$',
      currenciesAccepted: cafeConfig.currency.code,
      paymentAccepted: 'Espèces',
      image: isTodo(seo.siteUrl)
        ? asset('/images/og-image.jpg')
        : `${seo.siteUrl}/images/og-image.jpg`,
      hasMenu: {
        '@type': 'Menu',
        hasMenuSection: categories.map((category) => ({
          '@type': 'MenuSection',
          name: category.name,
          hasMenuItem: products
            .filter((p) => p.categoryId === category.id)
            .map((product) => ({
              '@type': 'MenuItem',
              name: product.name,
              ...(product.description ? { description: product.description } : {}),
              offers: {
                '@type': 'Offer',
                price: product.price,
                priceCurrency: cafeConfig.currency.code,
              },
            })),
        })),
      },
    };

    if (Object.keys(postalAddress).length > 2) data.address = postalAddress;
    if (!isTodo(phone)) data.telephone = phone;
    if (openingHours.length > 0) data.openingHours = openingHours;
    if (sameAs.length > 0) data.sameAs = sameAs;
    if (!isTodo(seo.siteUrl)) data.url = seo.siteUrl;
    if (!isTodo(mapsUrl)) data.hasMap = mapsUrl;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}
