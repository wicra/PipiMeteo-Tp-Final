# Structure Angular du projet

Ce document décrit l'organisation du code de PipiMeteo et le rôle de chaque dossier. La règle de base : chaque élément a une seule responsabilité principale.

## Arborescence

```text
src/app/
	core/
		services/       Services partagés et appels API (WeatherService)
		models/         Interfaces TypeScript et fixtures (WeatherData, ForecastData)
	shared/
		components/     Composants réutilisables partout (logo, rain-splash)
	pages/
		home/           Page d'accueil : présentation et recherche
		weather/        Page météo : lit la ville dans l'URL et affiche les données
		about/          Page de présentation : équipe et technologies
	components/
		navbar/         Barre de navigation
		search/         Formulaire de recherche
	app.ts            Composant racine : navbar, splash et router-outlet
	app.routes.ts     Définition des routes
	app.config.ts     Configuration de l'application (router, HttpClient)
```

## Routes

| URL | Page | Description |
| --- | --- | --- |
| `/` | - | Redirige vers `/home` |
| `/home` | Home | Accueil et formulaire de recherche |
| `/weather/:city` | Weather | Météo de la ville passée dans l'URL |
| `/about` | About | Membres de l'équipe et technologies |
| toute autre URL | - | Redirige vers `/home` |

La navigation se fait avec `routerLink` dans la navbar, et la page météo lit le paramètre `:city` avec `ActivatedRoute`.

## Qui fait quoi

- **Pages** (`pages/`) : correspondent aux routes. Elles assemblent les composants et coordonnent les données. Aucun appel HTTP, aucune logique métier.
- **Composants** (`components/`, `shared/components/`) : gèrent l'affichage et les interactions. Un enfant reçoit ses données avec `@Input` et remonte ses actions avec `@Output`. Ils ne connaissent jamais la réponse brute d'OpenWeather.
- **Services** (`core/services/`) : seul endroit qui communique avec l'API. `WeatherService` expose des types applicatifs propres et des signals d'état (`idle`, `loading`, `success`, `error`).
- **Models** (`core/models/`) : interfaces partagées par toute l'équipe et fixtures utilisées pendant le développement.

## Composant racine

`App` affiche l'écran de pluie au premier chargement de la session, puis la navbar et le `router-outlet`. Toutes les pages s'affichent dans ce `router-outlet` sous la navbar.

## Configuration

La clé API OpenWeather vient de la configuration locale (voir `environment.example.ts`) et n'est jamais commitée.
