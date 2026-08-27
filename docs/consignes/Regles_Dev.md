# Regles de developpement

Ces regles sont communes aux quatre developpeurs. Elles servent a garder une structure lisible, a eviter les doublons et a faciliter l'integration des branches.

## Structure du projet

Chaque element doit avoir une seule responsabilite principale.

```text
src/app/
	core/
		services/       Services partages et appels API
		models/         Interfaces et types TypeScript
		guards/         Protection des routes si necessaire
	shared/
		components/     Composants reutilisables
		pipes/           Pipes reutilisables
	pages/
		home/           Page d'accueil et orchestration de la recherche
		weather/        Page meteo et orchestration de l'affichage
		about/          Page de presentation
	components/
		navbar/         Navigation
		search/         Formulaire de recherche
		weather-card/   Affichage d'une meteo
		forecast/       Affichage des previsions
```

### Pages

- Les pages correspondent aux routes et assemblent les composants.
- Elles lisent les parametres de route et coordonnent les donnees necessaires.
- Elles ne contiennent pas d'appel HTTP ni de logique metier complexe.

### Components

- Les composants gerent l'affichage, les interactions utilisateur et les evenements.
- Un composant enfant recoit ses donnees avec `@Input` et remonte ses actions avec `@Output`.
- Un composant ne doit pas connaitre la structure brute de la reponse OpenWeather.
- Les composants reutilisables ne doivent pas dependre d'une page particuliere.

### Services

- Les appels HTTP et la logique metier appartiennent aux services.
- `WeatherService` est le seul endroit qui communique avec OpenWeather.
- Les services exposent des types applicatifs propres, pas la reponse brute de l'API.
- Les services ne manipulent pas directement le DOM et ne contiennent pas de logique de template.

### Models et configuration

- Les interfaces partagees sont placees dans `core/models`.
- Les types doivent decrire les donnees utilisees par l'application.
- La cle API est fournie par la configuration locale et ne doit jamais etre commit.
- Aucun secret, token ou identifiant sensible ne doit apparaitre dans le code ou les logs.

## Flux RxJS et cycle de vie

- Toute recherche saisie par l'utilisateur doit limiter les appels API avec `debounceTime`.
- Utiliser `distinctUntilChanged` pour ne pas rechercher deux fois la meme ville.
- Utiliser `switchMap` pour annuler la recherche precedente lorsqu'une nouvelle recherche commence.
- Nettoyer chaque abonnement avec `takeUntilDestroyed` ou utiliser directement le pipe `async` dans le template.
- Ne jamais laisser un `subscribe` sans strategie de destruction et sans gestion d'erreur.
- Utiliser `catchError` pour transformer les erreurs API en etat utilisable par l'interface.
- Utiliser `finalize` pour remettre l'etat de chargement a `false` dans tous les cas.
- Ne pas creer de boucle de requetes entre un signal, un observable et un composant.
- Eviter les appels API dans `ngOnInit` lorsqu'une donnee peut etre chargee uniquement apres une action utilisateur.
- Normaliser la ville avant la recherche : supprimer les espaces inutiles et comparer sans difference de casse.

Exemple de flux de recherche attendu :

```ts
search.valueChanges.pipe(
	debounceTime(300),
	map(value => value.trim()),
	distinctUntilChanged(),
	filter(value => value.length > 0),
	switchMap(city => weatherService.getWeather(city)),
	takeUntilDestroyed()
);
```

Le formulaire doit aussi verifier `Validators.required` au moment de la validation. `debounceTime` ne remplace pas la validation du formulaire.

## Etats d'interface

Chaque requete doit avoir des etats explicites et coherents :

- `idle` : aucune recherche effectuee.
- `loading` : requete en cours.
- `success` : donnees disponibles.
- `error` : message utilisateur disponible.

- Une erreur doit vider ou invalider les anciennes donnees si elles ne correspondent plus a la ville demandee.
- Un chargement doit etre visible avant et pendant la requete.
- Les messages affiches a l'utilisateur doivent rester en francais et etre comprehensibles.
- Les composants ne doivent pas dupliquer la logique de gestion des erreurs du service.

## Regles de codage

- Ecrire du code simple, lisible et coherent avec le code existant.
- Utiliser des noms explicites pour les variables, fonctions, composants et services.
- Une fonction doit faire une seule chose et rester courte lorsque c'est possible.
- Eviter les doublons : extraire une fonction, un composant ou un service lorsqu'il est reutilisable.
- Preferer les types explicites et eviter `any` sauf justification necessaire.
- Ne pas modifier des fichiers qui ne sont pas concernes par la fonctionnalite.
- Ne pas ajouter de dependance sans accord de l'equipe et justification dans le README.
- Ne pas effectuer de formatage global qui melange des changements sans rapport.

## Commentaires

- Ne pas ajouter de commentaires dans le code pour expliquer une ligne evidente.
- Les commentaires sont exceptionnels et doivent resumer une fonction ou une logique difficile a comprendre.
- Lorsqu'un commentaire est necessaire, il doit etre en MAJUSCULES et rester tres court.
- Ne pas utiliser de commentaires pour conserver du code mort : supprimer le code inutilise.

Exemple acceptable :

```ts
// CONVERTIT LES TEMPERATURES KELVIN EN CELSIUS
```

## Git et commits

- Une branche correspond a une fonctionnalite ou une correction precise.
- Un commit doit rester petit et contenir une seule intention.
- Les messages de commit sont courts, simples et sans description ni corps de message.
- Utiliser un verbe d'action au present, par exemple :
	- `ajoute le formulaire`
	- `corrige le routing`
	- `branche le service meteo`
	- `ajoute les previsions`
- Ne pas melanger refactorisation, changement visuel et correction dans le meme commit.
- Ne jamais commit une cle API, un fichier d'environnement reel ou des donnees sensibles.
- Avant une pull request, verifier le build, les tests et les conflits avec `main`.
- Chaque pull request doit etre relue par un autre developpeur.

## Integration entre developpeurs

- Les interfaces TypeScript et les noms de methodes publiques sont valides ensemble avant l'implementation.
- Les composants peuvent utiliser des fixtures pendant le developpement de l'API.
- Le changement d'une interface partagee doit etre annonce aux trois autres developpeurs.
- Les services restent remplacables par des fixtures pour permettre les tests sans cle API.
- Chaque developpeur teste sa branche avant integration et indique ce qui a ete verifie.
