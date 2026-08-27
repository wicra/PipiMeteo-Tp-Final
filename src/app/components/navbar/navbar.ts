import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { EMPTY, catchError, switchMap } from 'rxjs';

import { GeolocationService } from '../../core/services/geolocation.service';
import { WeatherService } from '../../core/services/weather.service';
import { Logo } from '../../shared/components/logo/logo';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, Logo],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly geolocationService = inject(GeolocationService);
  private readonly weatherService = inject(WeatherService);

  protected readonly localWeather = this.weatherService.localWeather;

  // L'API DE GEOLOCALISATION EST HEBERGEE SUR UN PLAN GRATUIT QUI SE MET EN VEILLE : LE PREMIER APPEL PEUT PRENDRE ~30S
  protected readonly localWeatherLoading = computed(
    () => this.geolocationService.loading() || this.weatherService.localWeatherStatus() === 'loading',
  );

  constructor() {
    this.geolocationService
      .getLocalCity()
      .pipe(
        switchMap((city) => this.weatherService.getLocalWeather(city).pipe(catchError(() => EMPTY))),
        catchError(() => EMPTY),
        takeUntilDestroyed(),
      )
      .subscribe();
  }
}