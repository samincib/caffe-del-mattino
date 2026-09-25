import type { ReactNode } from 'react';
import { cafeConfig, formatAddress, isTodo } from '../config/cafe';
import { buildContactUrl, isWhatsAppConfigured } from '../utils/whatsapp';
import { asset } from '../utils/asset';
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
} from './ui/Icons';

/** Affiche la valeur, ou une mention neutre si elle n'est pas renseignée. */
function Value({ value }: { value: string }) {
  if (isTodo(value)) {
    return <span className="text-forest-800/35 italic">À compléter</span>;
  }
  return <>{value}</>;
}

export function Contact() {
  const address = formatAddress();
  const { phone, social, mapsUrl, mapsEmbedUrl, hours } = cafeConfig;
  const whatsappReady = isWhatsAppConfigured();

  return (
    <section id="contact" className="grain bg-cream-100 py-20 md:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-[0.7rem] tracking-[0.25em] text-gold-600 uppercase">
            Contact
          </span>
          <h2 className="font-display text-3xl text-forest-900 sm:text-4xl lg:text-[2.75rem]">
            Nous trouver
          </h2>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-forest-800/70">
            Passez nous voir, appelez-nous ou envoyez votre commande sur WhatsApp.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
          {/* Coordonnées */}
          <div className="space-y-4">
            <InfoCard icon={<MapPinIcon className="size-5" />} title="Adresse">
              {address ? (
                <p className="text-forest-800/80">{address}</p>
              ) : (
                <p className="text-forest-800/35 italic">À compléter</p>
              )}
              {!isTodo(mapsUrl) && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-forest-700 underline underline-offset-4"
                >
                  Ouvrir dans Google Maps
                </a>
              )}
            </InfoCard>

            <InfoCard icon={<PhoneIcon className="size-5" />} title="Téléphone">
              {isTodo(phone) ? (
                <p className="text-forest-800/35 italic">À compléter</p>
              ) : (
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="text-forest-800/80 underline-offset-4 hover:underline"
                >
                  {phone}
                </a>
              )}
            </InfoCard>

            <InfoCard icon={<WhatsAppIcon className="size-5" />} title="WhatsApp">
              {whatsappReady ? (
                <a
                  href={buildContactUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <WhatsAppIcon className="size-4" />
                  Écrire au café
                </a>
              ) : (
                <p className="text-forest-800/35 italic">À compléter</p>
              )}
            </InfoCard>

            <InfoCard icon={<ClockIcon className="size-5" />} title="Horaires">
              <ul className="space-y-1.5">
                {hours.map((slot) => (
                  <li key={slot.day} className="flex justify-between gap-4 text-sm">
                    <span className="text-forest-800/70">{slot.day}</span>
                    <span className="font-medium text-forest-900">
                      <Value value={slot.value} />
                    </span>
                  </li>
                ))}
              </ul>
            </InfoCard>

            {/* Réseaux sociaux */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <SocialLink
                href={social.instagram}
                label="Instagram"
                icon={<InstagramIcon className="size-5" />}
              />
              <SocialLink
                href={social.facebook}
                label="Facebook"
                icon={<FacebookIcon className="size-5" />}
              />
            </div>
          </div>

          {/* Carte */}
          <div className="min-h-[22rem] overflow-hidden rounded-3xl border border-cream-300 bg-white shadow-soft lg:min-h-full">
            {isTodo(mapsEmbedUrl) ? <MapPlaceholder /> : (
              <iframe
                title="Localisation du Caffè Del Mattino"
                src={mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="size-full min-h-[22rem] border-0"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Bloc affiché tant que `mapsEmbedUrl` n'est pas renseigné dans la config.
 * Aucune adresse n'est inventée : on explique simplement quoi faire.
 */
function MapPlaceholder() {
  return (
    <div className="relative flex size-full min-h-[22rem] flex-col items-center justify-center overflow-hidden px-6 py-10 text-center">
      <div
        aria-hidden="true"
        style={{ backgroundImage: `url(${asset('/images/texture-vegetale-640.jpg')})` }}
        className="absolute inset-0 bg-cover bg-center opacity-10"
      />
      {/* Quadrillage discret évoquant un plan */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#14301f_1px,transparent_1px),linear-gradient(to_bottom,#14301f_1px,transparent_1px)] [background-size:2.5rem_2.5rem]"
      />
      <div className="relative">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-forest-800 text-cream-50">
          <MapPinIcon className="size-6" />
        </span>
        <h3 className="mt-4 font-display text-xl text-forest-900">Localisation du café</h3>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-forest-800/60">
          La carte s’affichera ici dès que l’adresse sera renseignée.
        </p>
        <p className="mx-auto mt-4 max-w-sm rounded-xl bg-cream-100 px-4 py-3 text-xs leading-relaxed text-forest-800/60">
          Google Maps → <strong>Partager</strong> → <strong>Intégrer une carte</strong> → copier le
          contenu de <code className="font-mono">src="…"</code> dans{' '}
          <code className="font-mono">mapsEmbedUrl</code> (fichier{' '}
          <code className="font-mono">src/config/cafe.ts</code>).
        </p>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-cream-300 bg-white p-5 shadow-soft">
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-xl bg-forest-50 text-forest-700"
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="mb-1.5 font-display text-lg text-forest-900">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  if (isTodo(href)) {
    return (
      <span className="flex items-center gap-2 rounded-full border border-dashed border-cream-400 px-4 py-2.5 text-sm text-forest-800/35">
        {icon}
        {label} — à compléter
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-full border border-cream-300 bg-white px-4 py-2.5 text-sm font-medium text-forest-800 shadow-soft transition-colors hover:border-wood-300 hover:text-forest-900"
    >
      {icon}
      {label}
    </a>
  );
}
