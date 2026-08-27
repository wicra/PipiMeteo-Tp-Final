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

A venir dans un commit dedie : animation plein ecran de pluie jaune pipi jouee une fois par session (memorisee en `sessionStorage`), qui se fond vers le contenu de l'application.
