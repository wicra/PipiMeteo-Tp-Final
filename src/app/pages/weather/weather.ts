import { Component, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, catchError, distinctUntilChanged, filter, map, switchMap } from 'rxjs';

import { Forecast } from '../../components/forecast/forecast';
import { WeatherCard } from '../../components/weather-card/weather-card';
import { WeatherService } from '../../core/services/weather.service';

@Component({
  selector: 'app-weather',
  imports: [WeatherCard, Forecast],
  templateUrl: './weather.html',
  styleUrl: './weather.css',
})
export class Weather {
  private readonly route = inject(ActivatedRoute);
  private readonly weatherService = inject(WeatherService);

  protected readonly city = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('city'))),
    { initialValue: null },
  );

  readonly currentWeather = this.weatherService.currentWeather;
  readonly currentWeatherStatus = this.weatherService.currentWeatherStatus;
  readonly currentWeatherError = this.weatherService.currentWeatherError;
  readonly forecast = this.weatherService.forecast;
  readonly forecastStatus = this.weatherService.forecastStatus;
  readonly forecastError = this.weatherService.forecastError;

  private readonly cityStream$ = this.route.paramMap.pipe(
    map((params) => params.get('city')),
    filter((city): city is string => city !== null),
    map((city) => city.trim()),
    filter((city) => city.length > 0),
    distinctUntilChanged((prev, curr) => prev.toLowerCase() === curr.toLowerCase()),
  );

  constructor() {
    // CHARGE LA METEO COURANTE AU CHANGEMENT DE VILLE
    this.cityStream$
      .pipe(
        switchMap((city) =>
          this.weatherService.getCurrentWeather(city).pipe(catchError(() => EMPTY)),
        ),
        takeUntilDestroyed(),
      )
      .subscribe();

    // CHARGE LES PREVISIONS AU CHANGEMENT DE VILLE
    this.cityStream$
      .pipe(
        switchMap((city) =>
          this.weatherService.getForecast(city).pipe(catchError(() => EMPTY)),
        ),
        takeUntilDestroyed(),
      )
      .subscribe();
  }
}