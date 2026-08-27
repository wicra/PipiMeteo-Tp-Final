# PipiMeteo

_À compléter par l'équipe : objectif du projet, présentation rapide de l'application._

## Membres

_À compléter par l'équipe._

## Technologies

- Angular 21 (composants standalone, signals, routing)
- TypeScript
- HTML / CSS
- [OpenWeather API](https://openweathermap.org/api) (météo actuelle + prévisions 5 jours)
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

_À compléter par l'équipe au fur et à mesure de l'avancement (formulaire de recherche, routing, affichage météo, gestion des erreurs...)._

## Fonctionnalités supplémentaires

_À compléter par l'équipe (fonctionnalité libre choisie et sa justification)._

## Architecture

_À compléter par l'équipe (organisation des dossiers, découpage des composants). Voir aussi [docs/consignes/Regles_Dev.md](docs/consignes/Regles_Dev.md) pour les conventions décidées en amont._

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

_À compléter par l'équipe (au moins deux difficultés et leur résolution)._

## Améliorations possibles

_À compléter par l'équipe._
