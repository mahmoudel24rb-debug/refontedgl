# Prompts de génération des visuels « Réalisations »

6 visuels, un par tuile de la section Réalisations (home et page /realisations). Chaque prompt est à coller tel quel dans ChatGPT (génération d'image) avec les pièces jointes indiquées. Les fichiers à joindre sont dans `app/public/assets/projets/` et `app/public/assets/logos/`.

## Formats à demander

| Tuile | Projet | Format | Taille à générer |
|---|---|---|---|
| Large (9/14) | GYMFIT refonte du site | 16:9 paysage | 1920 x 1080 |
| Étroite (5/14) | GYMFIT Meta Ads | 1:1 carré | 1536 x 1536 |
| Moitié (7/14) | Les Océades Noël | 4:3 paysage | 1600 x 1200 |
| Moitié (7/14) | Les Océades SEO | 4:3 paysage | 1600 x 1200 |
| Étroite (5/14) | Parc de Beauregard | 1:1 carré | 1536 x 1536 |
| Large (9/14) | Epicure Pilates Reformer | 16:9 paysage | 1920 x 1080 |

Les tuiles font 460 px de haut sur desktop avec un recadrage `object-cover` : garder le sujet principal au centre et rien d'important dans les 10 % des bords.

## Bloc de style commun

Ce paragraphe est répété en tête de chaque prompt pour que les 6 images soient homogènes. Ne pas le modifier entre deux générations.

```
STYLE COMMUN (ne pas dévier) : rendu 3D photoréaliste d'une interface flottante, style « product shot » d'agence marketing premium. Fond navy profond #002329 avec un léger dégradé vers #001519 et une grille très discrète en filigrane. Accent unique : corail #FE5752 pour les courbes, badges et boutons ; blanc et crème #F0EFE9 pour les cartes. Typographie sans-serif géométrique moderne (type Inter Tight), chiffres gros et gras. Cartes aux coins très arrondis (24 px), ombres douces, légère perspective isométrique (rotation 8 à 12 degrés), profondeur avec 2 ou 3 éléments qui flottent devant. Éclairage studio doux, aucun reflet agressif, aucun texte flou. Tout le texte visible est en français, sans faute, uniquement les libellés et chiffres donnés ci-dessous, aucun autre texte inventé. Pas de logos Meta, Facebook, Instagram ou Google (juste de petites icônes monochromes neutres si nécessaire). Pas de filigrane, pas de signature, pas de personnage supplémentaire.
```

## 1. GYMFIT, refonte du site (16:9, 1920 x 1080)

Pièces jointes : `gymfit-equipe.webp` (référence d'ambiance : néons, parquet, tenues noires) et `gymfit.webp` (logo).

```
[coller le STYLE COMMUN]

SUJET : mockup du nouveau site web de la salle de sport GYMFIT, présenté sur un MacBook ouvert vu de trois quarts, avec un iPhone posé devant à droite qui affiche la version mobile du même site. Le site à l'écran a une esthétique fitness premium : hero sombre avec une grande photo de salle de sport aux néons rouges (inspirée de la photo jointe, réinterprétée, pas copiée), gros titre blanc, bouton rouge, logo GYMFIT (utiliser exactement le logo joint, en haut à gauche de l'écran). Sur le mobile : la page « Nos clubs » avec des cartes de salles.

Éléments flottants autour de l'appareil, sur cartes crème arrondies :
- badge « 8 semaines » avec le sous-titre « de la maquette à la mise en ligne »
- carte « Performance » avec un cercle de score vert affichant « 96 »
- petit badge « SEO local » avec une épingle de carte corail

Composition : le laptop occupe 55 % de la largeur, légèrement décalé à gauche, le mobile en avant-plan à droite, les 3 badges répartis autour sans chevaucher les écrans. Fond navy, ambiance sombre et haut de gamme.
```

## 2. GYMFIT, Meta Ads 4,2x de ROAS (1:1, 1536 x 1536)

Pièce jointe : `gymfit-coach.webp` (référence d'ambiance uniquement).

```
[coller le STYLE COMMUN]

SUJET : tableau de bord publicitaire flottant (style gestionnaire de campagnes, sans logo de plateforme) montrant les résultats d'une campagne locale pour une salle de sport. Une grande carte blanche arrondie centrale en perspective, avec :
- en haut à gauche, le titre « Campagne acquisition locale » et un point vert « Active »
- trois tuiles de chiffres alignées : « 4,2x » avec le libellé « ROAS », « 0,78 € » avec « par prospect », « +181 % » avec « trafic organique »
- en dessous, une courbe corail qui monte régulièrement sur 3 mois, avec les repères « Mois 1 », « Mois 2 », « Mois 3 »

Devant la carte, décalée en bas à droite, une mini carte de ville stylisée (rues claires sur fond navy) avec un cercle corail semi-transparent et l'étiquette « Rayon 15 km ». En arrière-plan, très floutée et sombre, une ambiance de salle de sport (machines, néon rouge) inspirée de la photo jointe. Composition centrée, carrée, sujet dans le tiers central.
```

## 3. Les Océades, campagne de Noël (4:3, 1600 x 1200)

Pièces jointes : `oceades-equipe.webp` (ambiance institut bleu et bois) et `oceades.webp` (logo).

```
[coller le STYLE COMMUN]

SUJET : résultats d'une campagne publicitaire de Noël pour un institut de beauté et spa haut de gamme, Les Océades. Au centre gauche, un iPhone en perspective qui affiche une publicité au format story : visuel festif élégant (bougies, sapin discret, tons bleu nuit, doré léger et blanc), le logo Les Océades (utiliser exactement le logo joint) en haut, le texte « Offrez un moment de bien-être » et un bouton « Découvrir les offres ».

À droite, empilées avec un léger décalage, trois cartes crème arrondies :
- « +40 % » avec le libellé « ventes e-commerce pendant les fêtes » et une petite courbe corail montante
- « 58 prospects » avec « 3,25 € par prospect » et le sous-titre « Bilan peau offert »
- « 173 prospects » avec « 3,06 € par prospect » et le sous-titre « Pilates Reformer »

Quelques particules dorées très discrètes dans le fond navy pour l'esprit de Noël, sans surcharge. Composition équilibrée gauche/droite, format 4:3.
```

## 4. Les Océades, SEO +182 % (4:3, 1600 x 1200)

Pièce jointe : `oceades-soin.webp` (référence d'ambiance uniquement).

```
[coller le STYLE COMMUN]

SUJET : tableau de bord SEO et Google Ads flottant pour un institut de beauté. Grande carte blanche arrondie en perspective avec, en haut, le titre « Visibilité Google » et la période « 6 mois ».

Contenu de la carte :
- une grande courbe corail de trafic organique qui part bas à gauche et monte fortement, avec l'étiquette « +182 % trafic organique » au bout de la courbe
- une ligne de trois tuiles : « 352 » avec « mots-clés positionnés », « 80 % » avec « en top 10 », « x2,6 » avec « coût par formulaire divisé »
- en bas, un petit tableau de 3 lignes de mots-clés avec des positions « 1 », « 2 », « 3 » sur fond vert pâle : « institut de beauté le mans », « soin visage le mans », « pilates reformer le mans »

Devant la carte, en bas à droite, une petite carte flottante « Coût par formulaire » qui montre « 25,34 € » barré en gris puis « 9,70 € » en corail. Arrière-plan : ambiance spa très floutée et sombre inspirée de la photo jointe. Format 4:3.
```

## 5. Parc de Beauregard, 1,23 € par prospect (1:1, 1536 x 1536)

Pièces jointes : `beauregard-terrain.webp` (ambiance extérieure, terrain, enfants) et `beauregard.webp` (logo).

```
[coller le STYLE COMMUN]

SUJET : démonstration d'une campagne publicitaire à petit budget pour un parc de loisirs et de sport pour enfants, Parc de Beauregard. Au centre, une carte blanche arrondie en perspective avec le logo Parc de Beauregard (utiliser exactement le logo joint) en haut à gauche, puis :
- une jauge circulaire corail avec « 20 € » au centre et le libellé « par jour »
- deux tuiles côte à côte : « 182 prospects » avec « 4,13 € par prospect » et le sous-titre « Stages de février » ; « 46 prospects » avec « 1,23 € par prospect » et le sous-titre « Journée portes ouvertes »

Autour de la carte, trois petites notifications flottantes façon téléphone, empilées en cascade à droite : « Nouveau prospect », « Nouveau prospect », « Nouveau prospect », chacune avec une petite icône corail de formulaire, la troisième légèrement plus grande et plus proche. En arrière-plan, très flouté et sombre, un terrain de sport en extérieur avec de la verdure inspiré de la photo jointe (aucun visage reconnaissable). Composition carrée, sujet centré.
```

## 6. Epicure Social Club, lancement Pilates Reformer (16:9, 1920 x 1080)

Pièces jointes : `epicure-equipe.webp` (ambiance club, studio clair) et `epicure.webp` (logo).

```
[coller le STYLE COMMUN]

SUJET : lancement d'une offre Pilates Reformer pour un club de sport et bien-être, Epicure Social Club. Composition en trois plans sur un format large :

Plan gauche : un iPhone en perspective qui affiche un formulaire de contact natif ouvert depuis une publicité : en haut un visuel d'un studio de Pilates Reformer clair et élégant (machines reformer beiges, lumière naturelle, inspiré de la photo jointe, sans personne reconnaissable), le logo Epicure Social Club (utiliser exactement le logo joint), le titre « Séance découverte Pilates Reformer », deux champs « Prénom » et « Téléphone » et un bouton corail « Réserver ma séance ».

Plan central : deux cartes crème arrondies côte à côte, chacune avec une petite icône de cible : « Audience Avatar » avec le sous-titre « profil précis » et « Audience Broad » avec le sous-titre « portée large », reliées par une petite flèche à une carte plus grande en dessous : « ROAS x5,8 ».

Plan droit : deux tuiles empilées : « 56 prospects » avec « 4 € par prospect » et le sous-titre « en 4 semaines », et « +60 % » avec « de prospects qualifiés » et une petite courbe corail montante.

Fond navy, profondeur avec les cartes qui flottent à des hauteurs différentes, rien de coupé sur les bords.
```

## Après génération

1. Exporter chaque image en PNG à la taille indiquée.
2. Me les envoyer (ou les déposer dans `app/public/assets/projets/`) : je les convertis en WebP, je remplace les chemins `image` des 6 projets dans `app/src/site/content.ts` et je déploie.

Si un résultat s'éloigne du style commun, relancer la génération avec la mention « même style exactement que l'image précédente, ne change que le contenu décrit » en joignant la première image réussie.
