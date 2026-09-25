import { cafeConfig } from '../config/cafe';

const { decimals, label } = cafeConfig.currency;

/**
 * Formate un prix en dinars : 2 -> « 2 DT », 2.5 -> « 2,50 DT ».
 * Les entiers sont affichés sans décimales pour alléger la lecture.
 */
export function formatPrice(value: number): string {
  const isInteger = Number.isInteger(value);
  const formatted = value.toLocaleString('fr-FR', {
    minimumFractionDigits: isInteger ? 0 : decimals,
    maximumFractionDigits: decimals,
  });
  return `${formatted} ${label}`;
}

/** Comme `formatPrice` mais sans le suffixe de devise. */
export function formatAmount(value: number): string {
  const isInteger = Number.isInteger(value);
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: isInteger ? 0 : decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Arrondi monétaire : évite les 4.199999999999999 dus aux flottants.
 * Les prix tunisiens vont au millime, on arrondit donc à 3 décimales.
 */
export function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}
