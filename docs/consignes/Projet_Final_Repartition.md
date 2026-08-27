# Repartition parallele du projet PipiMeteo

Le but est que les quatre developpeurs puissent travailler en parallele. Aucun composant ne doit attendre la cle API ou la fin d'un autre composant pour commencer.

## Contrat commun a definir au debut

Dev 3 cree en premier les interfaces TypeScript et un fichier de donnees fictives. Les trois autres developpeurs utilisent ces types et ces donnees pendant qu'il travaille sur OpenWeather.

```ts
export interface WeatherData {
	city: string;
	country: string;
	temperature: number;
	feelsLike: number;
	description: string;
	humidity: number;
	windSpeed: number;
	icon: string;
}
```

Le service peut d'abord retourner la fixture, puis etre branche sur HTTP sans modifier les templates. C'est le point de liaison entre les lots.

## Dev 1 - Socle Angular, routing et navigation

### Travail independant

- Configurer les routes `/home`, `/weather/:city` et `/about`.
- Creer la structure des dossiers et la barre de navigation.
- Creer la page About avec les membres et les technologies.
- Ajouter les composants de page et les emplacements necessaires pour les contenus.
- Utiliser des placeholders pour le formulaire et la meteo : aucune API n'est necessaire.

### Livrables

- Application navigable entre les trois routes.
- Navbar responsive.
- Page About complete.
- Structure Angular documentee.

### Dependances

- Attend seulement les noms definitifs des composants, pas le service API.
- Peut tester `/weather/Paris` avec une ville ecrite dans l'URL.

## Dev 2 - Formulaire de recherche et design de la page d'accueil

### Travail independant

- Creer le formulaire Angular avec `ReactiveFormsModule` et `Validators.required`.
- Afficher `Veuillez saisir une ville.` pour une recherche vide.
- Naviguer vers `/weather/:city` apres validation.
- Concevoir la page d'accueil, l'etat vide, le chargement et les messages d'erreur.
- Ajouter les styles responsive et l'accessibilite de base.

### Livrables

- Formulaire fonctionnel sans appel API.
- Navigation testable avec n'importe quelle ville.
- Interface mobile et desktop.

### Dependances

- Utilise une route `/weather/:city` fournie par Dev 1.
- Ne doit pas attendre le service : il peut naviguer vers une page meteo placeholder.

## Dev 3 - API OpenWeather, service et etat

### Travail independant

- Definir les interfaces `WeatherData` et `ForecastData`.
- Creer les fixtures utilisees par les autres developpeurs.
- Implementer `WeatherService` avec un mode fixture facilement remplacable par HTTP.
- Brancher l'endpoint meteo actuelle et l'endpoint des previsions a 5 jours.
- Configurer `HttpClient`, la cle API hors Git et la conversion Kelvin vers Celsius.
- Gerer le chargement, les donnees et les erreurs 404, 401, 429 et reseau.
- Tester les requetes dans Postman et preparer la collection documentee.

### Livrables

- Service unique pour les appels API.
- Types partages et fixtures fiables.
- Messages `Ville introuvable.`, `Impossible de recuperer les donnees meteo.` et `Trop de requetes, veuillez reessayer dans quelques instants.`
- Collection Postman et exemple de configuration sans vraie cle.

### Dependances

- Les interfaces et fixtures doivent etre publiees rapidement.
- Le service HTTP peut etre termine sans bloquer les pages, car elles fonctionnent d'abord avec la fixture.

## Dev 4 - Affichage meteo, previsions et tests UI

### Travail independant

- Creer la page `/weather/:city` et lire le parametre avec `ActivatedRoute`.
- Afficher ville, pays, temperature, ressenti, description, humidite, vent et icone.
- Creer la section des previsions a 5 jours avec les donnees fictives du contrat commun.
- Gerer les vues chargement, succes, erreur et etat vide.
- Ajouter les tests de composants et les scenarios de verification du parcours utilisateur.

### Livrables

- Page meteo responsive et complete.
- Fonctionnalite libre des previsions.
- Icônes avec texte alternatif.
- Tests de l'affichage avec fixture et erreurs simulees.

### Dependances

- Utilise les interfaces et fixtures de Dev 3.
- Peut terminer tout le template avant que l'appel HTTP soit disponible.

## Regles pour eviter les blocages

- Chaque developpeur travaille sur une branche distincte et fait relire ses changements.
- Les composants utilisent les interfaces partagees, jamais la forme brute de la reponse OpenWeather.
- Les appels API restent uniquement dans `WeatherService`.
- Les donnees fictives servent au developpement et aux tests ; elles ne remplacent pas l'API dans la version finale.
- Les noms de fichiers et methodes sont fixes ensemble avant de commencer.
- Les conflits sont resolus au fur et a mesure, pas le dernier jour.

## Integration finale commune

1. Dev 3 remplace la fixture par les appels HTTP et verifie les conversions.
2. Dev 4 branche le service reel sur ses composants.
3. Dev 1 verifie le routing complet et les liens.
4. Dev 2 verifie le formulaire, les messages et le responsive.
5. Toute l'equipe teste les recherches valides, ville inexistante, formulaire vide, erreur 429 et previsions.
6. Toute l'equipe complete le README et prepare la demonstration.

## Repartition de la soutenance

- Dev 1 : architecture, composants et routing.
- Dev 2 : formulaire Reactive Forms et interface.
- Dev 3 : HttpClient, service, API, etat et erreurs.
- Dev 4 : affichage meteo, previsions et tests.
