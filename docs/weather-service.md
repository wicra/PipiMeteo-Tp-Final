# WeatherService — documentation de l'API interne

Service unique pour toute communication avec OpenWeather. Aucun composant ne doit appeler `HttpClient` directement : tout passe par `WeatherService` (`src/app/core/services/weather.service.ts`).

## Mode fixture / mode HTTP

Le service a un flag privé `useFixtures`. Tant qu'il vaut `true`, les méthodes retournent les données de `src/app/core/models/weather.fixtures.ts` (avec un `delay(400)` simulant la latence réseau) au lieu d'appeler l'API. Passer `useFixtures` à `false` bascule sur l'API réelle sans rien changer côté composants.

## Méthodes publiques

### `getCurrentWeather(city: string): Observable<WeatherData>`

Récupère la météo actuelle d'une ville.

- `city` : nom de ville brut (les espaces sont nettoyés automatiquement).
- Retourne un `Observable<WeatherData>` qui émet une fois la donnée reçue.
- Met à jour `currentWeather`, `currentWeatherError` et `currentWeatherStatus` pendant l'appel.
- En cas d'erreur, l'observable se termine en erreur (via `throwError`) après avoir mis à jour les signals — un appelant peut soit ignorer l'erreur (le message est déjà dans `currentWeatherError`), soit la `catchError` lui-même s'il a besoin d'une action locale.

### `getForecast(city: string): Observable<ForecastData>`

Récupère les prévisions à 5 jours d'une ville. Même comportement que `getCurrentWeather`, mais met à jour `forecast`, `forecastError` et `forecastStatus`.

### `searchCity(city: string): void`

Point d'entrée pour une recherche déclenchée pendant la frappe (ex. `input.valueChanges` d'un formulaire). Ne retourne rien : le résultat arrive via les signals `currentWeather*`.

Comportement interne : `debounceTime(300)` puis `distinctUntilChanged` (insensible à la casse) puis `switchMap` vers `getCurrentWeather`. Une nouvelle frappe annule automatiquement la requête précédente encore en cours. Les erreurs sont absorbées ici pour ne jamais casser le flux (le message reste lisible via `currentWeatherError`).

## État exposé (signals en lecture seule)

| Signal | Type | Description |
| --- | --- | --- |
| `currentWeather` | `WeatherData \| null` | Dernière météo reçue avec succès |
| `currentWeatherError` | `string \| null` | Message d'erreur à afficher, ou `null` |
| `currentWeatherStatus` | `'idle' \| 'loading' \| 'success' \| 'error'` | État courant de la météo actuelle |
| `forecast` | `ForecastData \| null` | Dernières prévisions reçues avec succès |
| `forecastError` | `string \| null` | Message d'erreur à afficher, ou `null` |
| `forecastStatus` | `'idle' \| 'loading' \| 'success' \| 'error'` | État courant des prévisions |

Ces signals suffisent pour piloter l'affichage d'un template (`@switch (weatherService.currentWeatherStatus())`) sans dupliquer la logique de gestion des erreurs dans les composants.

## Messages d'erreur

| Cause | Message affiché |
| --- | --- |
| Ville inexistante (404) | `Ville introuvable.` |
| Trop de requêtes (429) | `Trop de requêtes, veuillez réessayer dans quelques instants.` |
| Toute autre erreur (401, 500, réseau...) | `Impossible de récupérer les données météo.` |

## Utilisation type dans un composant

```ts
// Appel ponctuel (ex. page /weather/:city, ville lue depuis la route)
this.weatherService.getCurrentWeather(city).subscribe();

// Lecture de l'état dans le template
protected readonly status = this.weatherService.currentWeatherStatus;
protected readonly weather = this.weatherService.currentWeather;
protected readonly error = this.weatherService.currentWeatherError;
```

```ts
// Recherche en direct pendant la frappe (ex. formulaire de recherche)
this.searchControl.valueChanges
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe((value) => this.weatherService.searchCity(value ?? ''));
```
