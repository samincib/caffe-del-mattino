import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import type { OrderDetails, OrderType } from '../types';
import { cafeConfig } from '../config/cafe';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/format';
import { buildOrderMessage, buildWhatsAppUrl, isWhatsAppConfigured } from '../utils/whatsapp';
import { AlertIcon, ArrowLeftIcon, CheckIcon, WhatsAppIcon } from './ui/Icons';

const EMPTY: OrderDetails = {
  name: '',
  phone: '',
  orderType: 'a-emporter',
  tableNumber: '',
  comment: '',
};

type Errors = Partial<Record<'name' | 'phone' | 'tableNumber', string>>;

/**
 * Validation d'un numéro tunisien : 8 chiffres, éventuellement précédés de
 * l'indicatif 216 sous la forme +216, 00216 ou 216.
 */
function validatePhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 8) return true;
  if (digits.length === 11 && digits.startsWith('216')) return true;
  if (digits.length === 13 && digits.startsWith('00216')) return true;
  return false;
}

function validate(details: OrderDetails): Errors {
  const errors: Errors = {};
  if (details.name.trim().length < 2) {
    errors.name = 'Merci d’indiquer votre nom.';
  }
  if (!details.phone.trim()) {
    errors.phone = 'Merci d’indiquer votre téléphone.';
  } else if (!validatePhone(details.phone)) {
    errors.phone = 'Numéro invalide (8 chiffres, ex. 22 123 456).';
  }
  if (details.orderType === 'sur-place' && !details.tableNumber.trim()) {
    errors.tableNumber = 'Indiquez votre numéro de table.';
  }
  return errors;
}

export function CheckoutForm() {
  const { lines, total, setView, clear, close } = useCart();
  const { notify } = useToast();
  const [details, setDetails] = useState<OrderDetails>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);

  const configured = isWhatsAppConfigured();
  const message = buildOrderMessage(lines, details);

  const update = <K extends keyof OrderDetails>(key: K, value: OrderDetails[K]) => {
    setDetails((current) => ({ ...current, [key]: value }));
    // On ne revalide en direct qu'après une première tentative d'envoi,
    // pour ne pas afficher d'erreur pendant que le client tape.
    if (submitted) {
      setErrors(validate({ ...details, [key]: value }));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    const found = validate(details);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Amène le client sur le premier champ en erreur.
      const first = Object.keys(found)[0];
      document.getElementById(`champ-${first}`)?.focus();
      return;
    }

    if (!configured) {
      setSent(true);
      return;
    }

    window.open(buildWhatsAppUrl(buildOrderMessage(lines, details)), '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      notify('Message copié');
    } catch {
      notify('Copie impossible sur ce navigateur');
    }
  };

  /* ----------------------------- Écran final ----------------------------- */
  if (sent) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-6">
          <div className="mx-auto max-w-sm text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-forest-100 text-forest-700">
              <CheckIcon className="size-8" />
            </span>
            <h3 className="mt-5 font-display text-2xl text-forest-900">
              {configured ? 'Commande prête !' : 'Votre commande est prête'}
            </h3>

            {configured ? (
              <p className="mt-3 text-[0.95rem] leading-relaxed text-forest-800/70">
                WhatsApp devrait s’être ouvert avec votre commande. Il ne reste plus qu’à appuyer sur
                « Envoyer ». Si rien ne s’est ouvert, utilisez le bouton ci-dessous.
              </p>
            ) : (
              <div className="mt-4 rounded-2xl border border-gold-500/40 bg-gold-500/10 p-4 text-left">
                <p className="flex gap-2.5 text-sm leading-relaxed text-wood-800">
                  <AlertIcon className="mt-0.5 size-5 shrink-0 text-gold-600" />
                  <span>
                    Le numéro WhatsApp du café n’est pas encore configuré. Copiez le message
                    ci-dessous et envoyez-le manuellement.
                    <br />
                    <span className="mt-1 block text-xs opacity-80">
                      À renseigner dans <code className="font-mono">src/config/cafe.ts</code> →{' '}
                      <code className="font-mono">WHATSAPP_NUMBER</code>.
                    </span>
                  </span>
                </p>
              </div>
            )}

            <pre className="mt-5 max-h-56 overflow-y-auto rounded-2xl border border-cream-300 bg-cream-100 p-4 text-left font-sans text-[0.8rem] leading-relaxed whitespace-pre-wrap text-forest-800">
              {message}
            </pre>

            <div className="mt-5 flex flex-col gap-2.5">
              {configured && (
                <a
                  href={buildWhatsAppUrl(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <WhatsAppIcon className="size-5" />
                  Rouvrir WhatsApp
                </a>
              )}
              <button
                type="button"
                onClick={copyMessage}
                className="rounded-full border border-cream-300 bg-white px-6 py-3.5 text-sm font-semibold text-forest-900 transition-colors hover:bg-cream-100"
              >
                Copier le message
              </button>
              <button
                type="button"
                onClick={() => {
                  clear();
                  close();
                  setSent(false);
                  setDetails(EMPTY);
                  setSubmitted(false);
                  notify('Panier vidé');
                }}
                className="rounded-full px-6 py-3 text-sm font-medium text-forest-800/60 transition-colors hover:text-forest-900"
              >
                Terminer et vider le panier
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------- Formulaire ------------------------------ */
  return (
    <form onSubmit={handleSubmit} noValidate className="flex h-full flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
        <button
          type="button"
          onClick={() => setView('panier')}
          className="-ml-1 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-medium text-forest-800/70 transition-colors hover:text-forest-900"
        >
          <ArrowLeftIcon className="size-4" />
          Retour au panier
        </button>

        <Field
          id="champ-name"
          label="Votre nom"
          error={errors.name}
          required
          input={
            <input
              id="champ-name"
              type="text"
              value={details.name}
              onChange={(e) => update('name', e.target.value)}
              autoComplete="name"
              placeholder="Sami"
              className={inputClass(!!errors.name)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'erreur-name' : undefined}
            />
          }
        />

        <Field
          id="champ-phone"
          label="Téléphone"
          error={errors.phone}
          required
          hint="Pour vous joindre si besoin."
          input={
            <input
              id="champ-phone"
              type="tel"
              inputMode="tel"
              value={details.phone}
              onChange={(e) => update('phone', e.target.value)}
              autoComplete="tel"
              placeholder="22 123 456"
              className={inputClass(!!errors.phone)}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'erreur-phone' : undefined}
            />
          }
        />

        {/* Type de commande */}
        <fieldset>
          <legend className="mb-2 block text-sm font-semibold text-forest-900">
            Type de commande
          </legend>
          <div className="grid grid-cols-2 gap-2.5">
            {cafeConfig.orderTypes.dineIn && (
              <OrderTypeOption
                value="sur-place"
                label="Sur place"
                emoji="🪑"
                checked={details.orderType === 'sur-place'}
                onChange={() => update('orderType', 'sur-place')}
              />
            )}
            {cafeConfig.orderTypes.takeaway && (
              <OrderTypeOption
                value="a-emporter"
                label="À emporter"
                emoji="🛍️"
                checked={details.orderType === 'a-emporter'}
                onChange={() => update('orderType', 'a-emporter')}
              />
            )}
          </div>
        </fieldset>

        {/* Numéro de table : uniquement pour une commande sur place */}
        {details.orderType === 'sur-place' && (
          <div className="animate-fade-in">
            <Field
              id="champ-tableNumber"
              label="Numéro de table"
              error={errors.tableNumber}
              required
              input={
                <input
                  id="champ-tableNumber"
                  type="text"
                  inputMode="numeric"
                  value={details.tableNumber}
                  onChange={(e) => update('tableNumber', e.target.value)}
                  placeholder="4"
                  maxLength={10}
                  className={inputClass(!!errors.tableNumber)}
                  aria-invalid={!!errors.tableNumber}
                  aria-describedby={errors.tableNumber ? 'erreur-tableNumber' : undefined}
                />
              }
            />
          </div>
        )}

        <Field
          id="champ-comment"
          label="Commentaire"
          hint="Sans sucre, sans glace, bien cuit…"
          input={
            <textarea
              id="champ-comment"
              value={details.comment}
              onChange={(e) => update('comment', e.target.value)}
              rows={3}
              maxLength={400}
              placeholder="Une demande particulière ?"
              className={`${inputClass(false)} resize-none`}
            />
          }
        />
      </div>

      {/* Pied de panneau : total + envoi */}
      <div className="border-t border-cream-300 bg-cream-100/70 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm text-forest-800/70">Total à payer sur place</span>
          <span className="font-display text-2xl font-semibold text-forest-900">
            {formatPrice(total)}
          </span>
        </div>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-4 text-[0.95rem] font-semibold text-white shadow-lift transition-transform hover:scale-[1.01] active:scale-100"
        >
          <WhatsAppIcon className="size-5" />
          Envoyer la commande sur WhatsApp
        </button>
        <p className="mt-2.5 text-center text-xs leading-relaxed text-forest-800/55">
          Aucun paiement en ligne. Vous réglez directement au café.
        </p>
      </div>
    </form>
  );
}

/* ------------------------------ Sous-vues ------------------------------- */

const inputClass = (invalid: boolean) =>
  [
    'w-full rounded-xl border bg-white px-4 py-3 text-[0.95rem] text-forest-900 transition-colors',
    'placeholder:text-forest-800/30 focus:outline-none',
    invalid ? 'border-red-400 focus:border-red-500' : 'border-cream-300 focus:border-forest-500',
  ].join(' ');

interface FieldProps {
  id: string;
  label: string;
  input: ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
}

function Field({ id, label, input, error, hint, required }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-forest-900">
        {label}
        {required && (
          <span className="ml-1 text-wood-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {input}
      {hint && !error && <p className="mt-1.5 text-xs text-forest-800/50">{hint}</p>}
      {error && (
        <p id={`erreur-${id.replace('champ-', '')}`} role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

interface OrderTypeOptionProps {
  value: OrderType;
  label: string;
  emoji: string;
  checked: boolean;
  onChange: () => void;
}

function OrderTypeOption({ value, label, emoji, checked, onChange }: OrderTypeOptionProps) {
  return (
    <label
      className={[
        'flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-3.5 text-sm font-medium transition-colors',
        checked
          ? 'border-forest-700 bg-forest-800 text-cream-50'
          : 'border-cream-300 bg-white text-forest-800 hover:border-wood-300',
      ].join(' ')}
    >
      <input
        type="radio"
        name="type-commande"
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span aria-hidden="true">{emoji}</span>
      {label}
    </label>
  );
}
