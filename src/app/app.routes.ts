import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Weather } from './pages/weather/weather';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'weather/:city', component: Weather },
];
