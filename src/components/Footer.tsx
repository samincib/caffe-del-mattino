import type { ReactNode } from 'react';
import { cafeConfig, formatAddress, isTodo } from '../config/cafe';
import { buildContactUrl, isWhatsAppConfigured } from '../utils/whatsapp';
import { CupIcon, FacebookIcon, InstagramIcon, WhatsAppIcon } from './ui/Icons';

const LINKS = [
  { href: '#accueil', label: 'Accueil' },
  { href: '#menu', label: 'Menu' },
  { href: '#galerie', label: 'Galerie' },
  { href: '#contact', label: 'Contact' },
];

export function Footer() {
  const address = formatAddress();
  const year = new Date().getFullYear();
  const { social } = cafeConfig;

  return (
    <footer className="bg-forest-900 pb-safe-cart text-cream-200/70 md:pb-0">
      <div className="container-page py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Identité */}
          <div>
            <div className="flex items-center gap-3 text-cream-50">
              <span className="grid size-10 place-items-center rounded-full border border-gold-400/40 text-gold-300">
                <CupIcon className="size-5" />
              </span>
              <span className="font-display text-xl">{cafeConfig.name}</span>
            </div>
            <p className="mt-4 max-w-xs leading-relaxed">{cafeConfig.tagline}</p>
            {address && <p className="mt-4 text-sm text-cream-200/50">{address}</p>}
          </div>

          {/* Navigation */}
          <nav aria-label="Liens de bas de page">
            <h2 className="mb-4 font-display text-sm tracking-[0.2em] text-gold-300/80 uppercase">
              Navigation
            </h2>
            <ul className="space-y-2.5">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[0.95rem] transition-colors hover:text-cream-50"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Réseaux */}
          <div>
            <h2 className="mb-4 font-display text-sm tracking-[0.2em] text-gold-300/80 uppercase">
              Nous suivre
            </h2>
            <div className="flex gap-2.5">
              {isWhatsAppConfigured() && (
                <IconLink href={buildContactUrl()} label="WhatsApp">
                  <WhatsAppIcon className="size-5" />
                </IconLink>
              )}
              {!isTodo(social.instagram) && (
                <IconLink href={social.instagram} label="Instagram">
                  <InstagramIcon className="size-5" />
                </IconLink>
              )}
              {!isTodo(social.facebook) && (
                <IconLink href={social.facebook} label="Facebook">
                  <FacebookIcon className="size-5" />
                </IconLink>
              )}
            </div>
            {isTodo(social.instagram) && isTodo(social.facebook) && !isWhatsAppConfigured() && (
              <p className="text-sm text-cream-200/35 italic">À compléter</p>
            )}
          </div>
        </div>

        {/* Bas de page */}
        <div className="mt-12 flex flex-col gap-3 border-t border-cream-100/10 pt-6 text-sm text-cream-200/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {cafeConfig.name}. Tous droits réservés.
          </p>
          <p className="text-cream-200/35">
            Prix en dinars tunisiens · Commande sans paiement en ligne · Règlement sur place
          </p>
        </div>
      </div>
    </footer>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-11 place-items-center rounded-full border border-cream-100/15 text-cream-100 transition-colors hover:border-gold-400/50 hover:bg-forest-800 hover:text-gold-300"
    >
      {children}
    </a>
  );
}
