import type { CartLine, OrderDetails } from '../types';
import { cafeConfig, isTodo, WHATSAPP_NUMBER } from '../config/cafe';
import { getCategory } from '../data/menu';
import { cartTotal, lineSubtotal } from './cart';
import { formatPrice } from './format';

/** Le numéro WhatsApp est-il renseigné dans `config/cafe.ts` ? */
export const isWhatsAppConfigured = (): boolean => !isTodo(WHATSAPP_NUMBER);

/**
 * Compose le message envoyé au café.
 *
 * Le rendu est volontairement en texte simple : WhatsApp n'accepte ni
 * tableaux ni retours à la ligne exotiques, et le message doit rester
 * lisible tel quel par la personne au comptoir.
 */
export function buildOrderMessage(lines: CartLine[], details: OrderDetails): string {
  const items = lines.map((line) => {
    const emoji = getCategory(line.product.categoryId)?.emoji ?? '•';
    return `${emoji} ${line.product.name} x${line.quantity} : ${formatPrice(lineSubtotal(line))}`;
  });

  const parts: string[] = [
    `Bonjour ${cafeConfig.name} 👋`,
    '',
    'Je souhaite passer la commande suivante :',
    '',
    ...items,
    '',
    `Total : ${formatPrice(cartTotal(lines))}`,
    '',
    `Nom : ${details.name.trim()}`,
    `Téléphone : ${details.phone.trim()}`,
  ];

  if (details.orderType === 'sur-place') {
    const table = details.tableNumber.trim();
    parts.push(`Commande : Sur place${table ? ` — table ${table}` : ''}`);
  } else {
    parts.push('Commande : À emporter');
  }

  const comment = details.comment.trim();
  if (comment) {
    parts.push('', 'Commentaire :', comment);
  }

  parts.push('', 'Merci !');
  return parts.join('\n');
}

/**
 * Construit le lien WhatsApp.
 *
 * `wa.me` est utilisé car il fonctionne aussi bien sur mobile (ouverture de
 * l'application) que sur ordinateur (bascule vers WhatsApp Web).
 */
export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Lien WhatsApp « simple contact », sans commande. */
export function buildContactUrl(message = `Bonjour ${cafeConfig.name} 👋`): string {
  return buildWhatsAppUrl(message);
}
