# PipiMeteo

Application météo réalisée en équipe dans le cadre du projet final Angular. Elle permet de rechercher une ville et de consulter sa météo actuelle (température, ressenti, description, humidité, vent, icône) ainsi que ses prévisions à 5 jours, via l'API OpenWeather.

## Membres

| Membre | Rôle |
| --- | --- |
| Killian | Socle Angular, routing et navigation |
| Wicramachine | Formulaire de recherche et page d'accueil |
| Gregory | API OpenWeather, service et état |
| Ayman | Affichage météo, prévisions et tests UI |

## Technologies

- Angular 21 (composants standalone, signals, routing)
- TypeScript
- RxJS (debounce, switchMap, gestion des flux asynchrones)
- HTML / CSS
- [OpenWeather API](https://openweathermap.org/api) (météo actuelle + prévisions 5 jours)
- Vitest (tests unitaires et de composants)
- Postman (tests et documentation des requêtes API)

## Installation

```bash
npm install
```

Voir la section [Configuration](#configuration) avant de lancer le serveur : l'application a besoin d'une clé API OpenWeather pour fonctionner (ou utilise le mode fixture par défaut, voir plus bas).

```bash
ng serve
```

Ouvrir ensuite `http://localhost:4200/`.

## Configuration

La clé API OpenWeather n'est jamais commitée sur Git. Elle est fournie via un fichier `environment.ts` à la racine du projet, ignoré par `.gitignore`.

1. Copier `environment.example.ts` vers `environment.ts` :

   ```bash
   cp environment.example.ts environment.ts
   ```

2. Remplacer `VOTRE_CLE_API_ICI` par ta clé personnelle OpenWeather (récupérable sur [openweathermap.org](https://openweathermap.org/), onglet "API keys" après création d'un compte gratuit).

3. Une clé API OpenWeather n'est pas active immédiatement : l'activation peut prendre jusqu'à 2h après sa création.

Tant que `environment.ts` n'est pas configuré, ou que `WeatherService` est en mode fixture (voir section [API](#api-openweather)), l'application fonctionne avec des données fictives et n'a pas besoin de clé valide pour être testée.

## Fonctionnalités obligatoires

- Page d'accueil (`/home`) avec présentation de l'application et formulaire de recherche.
- Formulaire de recherche en Reactive Forms, validation obligatoire (`Veuillez saisir une ville.` si le champ est vide ou ne contient que des espaces).
- Routing avec les 3 routes demandées : `/home`, `/weather/:city`, `/about` (+ redirection `**` vers `/home`).
- Page météo (`/weather/:city`) affichant ville, pays, température, ressenti, description, humidité, vent et icône, à partir du paramètre de route.
- Page About avec présentation du projet, membres de l'équipe et technologies utilisées.
- Navbar responsive présente sur toutes les pages.
- Communication avec l'API OpenWeather réalisée uniquement dans `WeatherService` (aucun appel HTTP dans les composants).
- Gestion des états de chargement (`Chargement de la météo…`) et des erreurs : ville introuvable (404), quota dépassé (429), erreur générique — voir [section API](#api-openweather).
- Anti-spam sur la recherche : `debounceTime` + `distinctUntilChanged` pour éviter les appels API inutiles en cas de frappe rapide ou de recherches répétées sur la même ville.
- Communication entre composants via `@Input`/signals (`WeatherCard`, `Forecast` reçoivent leurs données en entrée, aucun composant enfant ne connaît la réponse brute d'OpenWeather).
- Tests unitaires et de composants (formulaire, service météo, page météo, navbar, page d'accueil).

## Fonctionnalités supplémentaires

**Prévisions météo à 5 jours** (fonctionnalité libre) : en plus de la météo actuelle, l'application affiche les prévisions sur 5 jours pour la ville recherchée, via l'endpoint `/forecast` d'OpenWeather (voir [section API](#api-openweather)). Chaque jour affiche température, description et icône, avec gestion indépendante de ses propres états de chargement/erreur.

Petit bonus visuel : un écran de chargement animé (petites gouttes jaunes) s'affiche à chaque ouverture de l'application.

## Architecture

```text
src/app/
  core/
    services/       WeatherService : seul point de communication avec OpenWeather
    models/          Interfaces partagées (WeatherData, ForecastData) et fixtures
  shared/
    components/     Composants réutilisables (logo, écran de chargement)
  pages/
    home/           Page d'accueil : présentation et recherche
    weather/        Page météo : lit la ville dans l'URL et affiche les données
    about/          Page de présentation : équipe et technologies
  components/
    navbar/         Barre de navigation
    search/         Formulaire de recherche
    weather-card/   Carte d'affichage de la météo actuelle
    forecast/       Section des prévisions à 5 jours
```

- **Pages** correspondent aux routes, assemblent les composants et lisent les paramètres d'URL. Aucun appel HTTP ni logique métier.
- **Composants** gèrent l'affichage et les interactions ; ils reçoivent leurs données via `@Input`/`input()` et ne connaissent jamais la réponse brute d'OpenWeather.
- **Services** (`core/services/`) sont le seul endroit qui communique avec l'API.
- **Models** (`core/models/`) regroupent les interfaces partagées par toute l'équipe.

Voir aussi [docs/structure.md](docs/structure.md) et [docs/consignes/Regles_Dev.md](docs/consignes/Regles_Dev.md) pour le détail des conventions décidées en amont par l'équipe.

## API OpenWeather

Toute la communication avec OpenWeather passe par `WeatherService` (`src/app/core/services/weather.service.ts`) — aucun composant n'appelle `HttpClient` directement. Documentation détaillée des méthodes disponibles : [docs/weather-service.md](docs/weather-service.md).

### Endpoints utilisés

| Fonction | Méthode | URL | Paramètres |
| --- | --- | --- | --- |
| Météo actuelle | GET | `https://api.openweathermap.org/data/2.5/weather` | `q` (ville), `appid` (clé API) |
| Prévisions 5 jours | GET | `https://api.openweathermap.org/data/2.5/forecast` | `q` (ville), `appid` (clé API) |

### Données récupérées

- Météo actuelle : ville, pays, température, ressenti, description, humidité, vitesse du vent, icône.
- Prévisions : une entrée par jour sur 5 jours (température, description, icône), extraite des relevés toutes les 3h renvoyés par l'API.

### Conversions

- Température : Kelvin (renvoyé par l'API) → Celsius, arrondi au dixième.
- Vent : m/s (renvoyé par l'API) → km/h.

### Gestion des erreurs

| Cas | Message affiché |
| --- | --- |
| Ville introuvable (404) | `Ville introuvable.` |
| Trop de requêtes (429) | `Trop de requêtes, veuillez réessayer dans quelques instants.` |
| Autre erreur (401, 500, réseau...) | `Impossible de récupérer les données météo.` |

### Mode fixture

`WeatherService` peut fonctionner avec des données fictives (`src/app/core/models/weather.fixtures.ts`) sans appeler l'API réelle, le temps que la clé soit configurée et validée. Le passage entre les deux modes se fait via un seul flag interne au service, sans modifier les composants qui l'utilisent.

## Postman

La collection Postman du projet se trouve dans [`docs/PipiMeteo.postman_collection.json`](docs/PipiMeteo.postman_collection.json).

### Import

1. Ouvrir Postman → **Import** → sélectionner le fichier `docs/PipiMeteo.postman_collection.json`.
2. Dans les variables de la collection, renseigner `api_key` avec ta propre clé OpenWeather (le fichier exporté ne contient pas de vraie clé).
3. `base_url` est déjà pré-rempli (`https://api.openweathermap.org/data/2.5`).

### Contenu

- **Current Weather** : requêtes pour Paris, Lille et Tokyo.
- **Forecast** : requête de prévisions à 5 jours, paramétrée par la variable `{{city}}`.

Chaque requête est documentée dans son onglet **Description** (objectif, méthode, paramètres, réponse attendue, données récupérées) et contient des tests automatiques (statut 200, présence des champs attendus) visibles dans l'onglet **Tests**.

## Difficultés rencontrées

**1. Deux implémentations concurrentes de `WeatherService`.** Pendant que le service officiel était développé et documenté, un autre membre de l'équipe a implémenté sa propre version du service (méthodes, fixtures et tests différents) sans se synchroniser sur le contrat commun. Le merge a cassé le build (import dupliqué dans `app.config.ts`) et supprimé les fixtures officielles. Résolution : annulation propre du merge fautif avec `git revert` (sans réécrire l'historique), puis reprise du travail à partir de la version officielle du service, avec ses méthodes documentées dans [docs/weather-service.md](docs/weather-service.md).

**2. Fichiers CSS manquants au build.** Après l'intégration de la page météo, `ng build` échouait avec des erreurs `NG2008: Could not find stylesheet file`. Deux nouveaux composants référençaient des fichiers `.css` jamais créés, et un fichier existant avait été supprimé par erreur alors qu'il était toujours référencé par `styleUrl`. Résolution : recréation des fichiers manquants, en gardant une séparation claire entre l'intégration fonctionnelle (faite en premier) et la passe de style (faite ensuite par l'équipe).

**3. Animation de démarrage qui ne rejouait qu'une fois.** L'écran de chargement animé utilisait `sessionStorage` pour ne s'afficher qu'une seule fois par session de navigateur, ce qui donnait l'impression qu'elle ne fonctionnait pas dès qu'on rechargeait la page pendant les tests. Résolution : suppression de la persistance dans `sessionStorage`, l'animation se rejoue désormais à chaque chargement complet de l'application.

## Améliorations possibles

- Ajouter un cache côté service pour éviter de refaire un appel API si la même ville est recherchée peu de temps après.
- Ajouter des tests end-to-end couvrant le parcours complet (recherche → affichage météo → prévisions).
- Enrichir la fonctionnalité libre avec un historique des dernières villes recherchées (via `localStorage`).
- Finaliser une passe d'accessibilité complète sur l'ensemble des pages (contrastes, focus, lecteurs d'écran).
