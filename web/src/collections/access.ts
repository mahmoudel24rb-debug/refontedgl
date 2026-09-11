import type { Access, PayloadRequest } from 'payload'

/**
 * Regles d'acces partagees par les collections.
 *
 * Les routes serveur passent par la local API (overrideAccess par
 * defaut) : ces regles ne concernent que l'admin et l'API REST.
 */

/** Lecture ouverte a tous (contenus publics). */
export const publique: Access = () => true

/** Reserve aux comptes connectes. */
export const connecte: Access = ({ req }) => Boolean(req.user)

/** Reserve au role admin. */
export const admin: Access = ({ req }) => req.user?.role === 'admin'

/** Admin ou editeur : gestion du contenu editorial. */
export const redaction: Access = ({ req }) =>
  req.user?.role === 'admin' || req.user?.role === 'editeur'

/** Interdit a tout le monde : ecriture reservee au code serveur. */
export const serveurUniquement: Access = () => false

/**
 * Acces au back-office.
 *
 * access.admin doit rendre un booleen strict, contrairement aux autres
 * regles qui peuvent rendre une clause Where.
 */
export const accesBackOffice = ({ req }: { req: PayloadRequest }): boolean =>
  Boolean(req.user)
