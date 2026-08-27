import { Component } from '@angular/core';

interface Member {
  name: string;
  role: string;
}

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  protected readonly members: Member[] = [
    { name: 'Killian', role: 'Socle Angular, routing et navigation' },
    { name: 'Wicramachine', role: 'Formulaire de recherche et page d\'accueil' },
    { name: 'Gregory', role: 'API OpenWeather, service et état' },
    { name: 'Ayman', role: 'Affichage météo, prévisions et tests UI' },
  ];

  protected readonly technologies: string[] = [
    'Angular 21',
    'TypeScript',
    'RxJS et Signals',
    'API OpenWeather',
    'Vitest',
    'Postman',
  ];
}