/**
 * Formatage francais des valeurs du simulateur de ROI.
 *
 * Reprend a l'identique les helpers de `roi-calculator.js` :
 * arrondi puis separateur de milliers fr-FR, virgule decimale pour les
 * pourcentages et les couts par clic.
 */

/** Nombre entier separe par milliers (formatNumber du JS WordPress). */
export function formatNumber(valeur: number): string {
  return Math.round(valeur).toLocaleString('fr-FR')
}

/** Montant en euros, arrondi a l'unite (formatCurrency du JS WordPress). */
export function formatCurrency(valeur: number): string {
  return `${Math.round(valeur).toLocaleString('fr-FR')} €`
}

/** Pourcentage a une decimale, virgule francaise (formatPercent du JS WP). */
export function formatPercent(valeur: number): string {
  return `${valeur.toFixed(1).replace('.', ',')} %`
}

/** Cout par clic a deux decimales, virgule francaise. */
export function formatCpc(valeur: number): string {
  return `${valeur.toFixed(2).replace('.', ',')} €`
}

/** ROI entier suivi du signe pourcent, comme les compteurs animes WP. */
export function formatRoi(valeur: number): string {
  return `${Math.round(valeur)}%`
}
