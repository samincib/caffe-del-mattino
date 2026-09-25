import { useEffect, useRef, useState } from 'react';
import { cafeConfig } from '../config/cafe';
import { useCart } from '../context/CartContext';
import { CartIcon, CloseIcon, CupIcon, MenuIcon } from './ui/Icons';

const NAV_LINKS = [
  { href: '#accueil', label: 'Accueil' },
  { href: '#menu', label: 'Menu' },
  { href: '#a-propos', label: 'À propos' },
  { href: '#galerie', label: 'Galerie' },
  { href: '#contact', label: 'Contact' },
];

/** Identifiants des sections observées pour surligner le lien courant. */
const SECTION_IDS = NAV_LINKS.map((l) => l.href.slice(1));

export function Header() {
  const { count, open } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('accueil');
  const panelRef = useRef<HTMLDivElement>(null);

  /* Le header devient opaque dès que la page défile. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Surlignage du lien correspondant à la section visible. */
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // La section « active » est la plus haute de celles actuellement visibles.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // La zone de détection commence sous le header et couvre le haut de l'écran.
      { rootMargin: '-88px 0px -55% 0px', threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* Menu mobile : fermeture au clavier et retour du focus. */
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const linkClass = (href: string) => {
    const isActive = active === href.slice(1);
    return [
      'relative py-2 text-sm font-medium transition-colors',
      isActive ? 'text-cream-50' : 'text-cream-200/80 hover:text-cream-50',
      'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-gold-400 after:transition-transform',
      isActive ? 'after:scale-x-100' : 'after:scale-x-0',
    ].join(' ');
  };

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled || mobileOpen
          ? 'bg-forest-900/95 shadow-lift backdrop-blur-md'
          : 'bg-gradient-to-b from-forest-950/75 to-transparent',
      ].join(' ')}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
        {/* Logo */}
        <a
          href="#accueil"
          className="flex shrink-0 items-center gap-2.5 text-cream-50"
          onClick={() => setMobileOpen(false)}
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-gold-400/50 bg-forest-800/60 text-gold-300 md:size-10">
            <CupIcon className="size-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[0.95rem] font-semibold tracking-tight md:text-lg">
              {cafeConfig.name}
            </span>
            <span className="mt-0.5 hidden text-[0.62rem] tracking-[0.22em] text-gold-300/80 uppercase sm:block">
              Café · Petit déjeuner
            </span>
          </span>
        </a>

        {/* Navigation bureau */}
        <nav aria-label="Navigation principale" className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={linkClass(link.href)}
              aria-current={active === link.href.slice(1) ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Bouton panier : toujours visible, y compris sur mobile */}
          <button
            type="button"
            onClick={() => open('panier')}
            className="relative grid size-10 place-items-center rounded-full border border-cream-100/25 text-cream-50 transition-colors hover:border-gold-400/60 hover:bg-forest-800/70 md:size-11"
            aria-label={
              count > 0 ? `Ouvrir le panier, ${count} article${count > 1 ? 's' : ''}` : 'Ouvrir le panier (vide)'
            }
          >
            <CartIcon className="size-5" />
            {count > 0 && (
              <span
                key={count}
                className="animate-bump absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-gold-500 px-1 text-[0.7rem] leading-5 font-bold text-forest-950"
              >
                {count}
              </span>
            )}
          </button>

          {/* CTA bureau */}
          <button
            type="button"
            onClick={() => open(count > 0 ? 'commande' : 'panier')}
            className="hidden rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-forest-950 transition-colors hover:bg-gold-400 lg:block"
          >
            Commander
          </button>

          {/* Bascule mobile */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full border border-cream-100/25 text-cream-50 transition-colors hover:bg-forest-800/70 lg:hidden"
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
            aria-controls="menu-mobile"
          >
            {mobileOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </div>

      {/* Panneau de navigation mobile */}
      <div
        id="menu-mobile"
        ref={panelRef}
        className={[
          'overflow-hidden border-t border-cream-100/10 bg-forest-900/98 backdrop-blur-md transition-[max-height,opacity] duration-300 lg:hidden',
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <nav aria-label="Navigation mobile" className="container-page flex flex-col py-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              tabIndex={mobileOpen ? 0 : -1}
              className="flex items-center justify-between border-b border-cream-100/8 py-3.5 text-base text-cream-100 last:border-0"
            >
              {link.label}
              <span aria-hidden="true" className="text-gold-400/60">
                ›
              </span>
            </a>
          ))}
          <button
            type="button"
            tabIndex={mobileOpen ? 0 : -1}
            onClick={() => {
              setMobileOpen(false);
              open(count > 0 ? 'commande' : 'panier');
            }}
            className="mt-3 mb-1 rounded-full bg-gold-500 py-3 text-center text-sm font-semibold text-forest-950"
          >
            Commander
          </button>
        </nav>
      </div>

      {/* Voile de fermeture quand le menu mobile est ouvert */}
      {mobileOpen && (
        <button
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 -z-10 cursor-default bg-forest-950/40 lg:hidden"
        />
      )}
    </header>
  );
}
