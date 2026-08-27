# Design system PipiMeteo

Intention visuelle : un design epure, avec un clin d'oeil au nom de l'application. Au chargement, un ecran de pluie jaune "pipi" s'anime en plein ecran puis se fond pour laisser apparaitre l'application. Le titre utilise une typographie atypique et un logo illustre le theme.

## Variables CSS (`src/app/app.css`)

Les variables communes sont definies sur `:host` du composant racine `App`, pas sur `:root`. Sous l'encapsulation par defaut d'Angular, un selecteur `:root` place dans le CSS scope d'un composant est reecrit en `[_ngcontent-xxx]:root`, qui ne correspond a aucun element : la regle ne s'applique jamais. `:host` est reecrit en `[_nghost-xxx]`, qui cible bien l'element `<app-root>` et cascade normalement vers toute l'application.

Categories disponibles pour toute l'equipe :

- Couleurs : `--color-background`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-primary`, `--color-primary-contrast`, `--color-pee` (jaune pipi), `--color-pee-dark`, `--color-error`, `--color-success`.
- Typographie : `--font-family-base` (pile systeme), `--font-family-heading` (police d'accroche).
- Espacements : `--space-1` a `--space-8`.
- Rayons : `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`.
- Ombres : `--shadow-sm`, `--shadow-md`.
- Transitions : `--transition-fast`, `--transition-base`, `--transition-slow`.

## Typographie

Le titre utilise la police "Baloo 2" (Google Fonts, chargee dans `src/index.html`), assignee a `--font-family-heading`. Le reste du texte utilise la pile systeme par defaut (`--font-family-base`).

## Logo

`src/app/shared/components/logo` : pictogramme SVG reutilisable representant un bonhomme stylise, avec un jet en pointilles jaune pipi. Accepte un input `size` (px). Accessible via `role="img"` et un `<title>`.

## Ecran de pluie au demarrage

`src/app/shared/components/rain-splash` : overlay plein ecran (`position: fixed`, `z-index: 999`) au-dessus du `router-outlet` dans `App`. Fond jaune pipi (`--color-pee`) avec un motif de rayures diagonales anime en boucle (`repeating-linear-gradient` + `background-position`) pour simuler la pluie, sans multiplier les elements DOM.

- Duree : ~1,4s d'animation puis ~0,6s de fondu (opacite) avant disparition complete.
- Jouee une seule fois par session via `sessionStorage` (cle `pipimeteo-splash-shown`), pas a chaque navigation interne.
- Respecte `prefers-reduced-motion` : si l'utilisateur a active la reduction des animations au niveau systeme, l'ecran de pluie est saute immediatement.
- Marque `aria-hidden="true"` car purement decoratif, sans element interactif ni contenu a annoncer aux lecteurs d'ecran.

## Accessibilite

- `--color-error` a ete ajuste (`#b91c1c`) pour atteindre un contraste AA (~6,35:1) sur le fond clair ; la teinte initiale (`#d1453d`) etait tout juste sous le seuil de 4,5:1.
- Le message discret de la page d'accueil n'utilise plus d'opacite reduite (une opacite de 0.7 sur `--color-text-muted` faisait chuter le contraste a ~3,08:1, sous le seuil AA) : la discretion vient uniquement de la taille et de l'italique.
- `lang="fr"` sur `<html>` (`src/index.html`), le contenu de l'application etant en francais.
- Le champ ville expose `aria-invalid` et `aria-describedby` vers le message d'erreur uniquement quand celui-ci est affiche.
- Les etats `:focus-visible` (input, bouton) sont visibles au clavier avec un contour `--color-primary`.
