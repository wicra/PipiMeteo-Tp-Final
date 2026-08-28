import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Observable,
  Subject,
  catchError,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  of,
  switchMap,
  tap,
  throwError
} from 'rxjs';

import { environment } from '../../../../environment';
import { getForecastFixture, WEATHER_FIXTURES } from '../models/weather.fixtures';
import { ForecastData, RequestStatus, WeatherData } from '../models/weather.model';

export function kelvinToCelsius(kelvin: number): number {
  return Math.round((kelvin - 273.15) * 10) / 10;
}

interface OpenWeatherCurrentResponse {
  name: string;
  sys: { country: string };
  main: { temp: number; feels_like: number; humidity: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}

interface OpenWeatherForecastResponse {
  city: { name: string; country: string };
  list: {
    dt_txt: string;
    main: { temp: number };
    weather: { description: string; icon: string }[];
  }[];
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);

  // MODE FIXTURE EN SECOURS SI L'API OPENWEATHER EST INDISPONIBLE
  private readonly useFixtures = false;

  private readonly citySearch$ = new Subject<string>();

  private readonly currentWeatherSignal = signal<WeatherData | null>(null);
  private readonly currentWeatherErrorSignal = signal<string | null>(null);
  private readonly currentWeatherLoadingSignal = signal(false);

  private readonly forecastSignal = signal<ForecastData | null>(null);
  private readonly forecastErrorSignal = signal<string | null>(null);
  private readonly forecastLoadingSignal = signal(false);

  private readonly localWeatherSignal = signal<WeatherData | null>(null);
  private readonly localWeatherErrorSignal = signal<string | null>(null);
  private readonly localWeatherLoadingSignal = signal(false);

  readonly currentWeather = this.currentWeatherSignal.asReadonly();
  readonly currentWeatherError = this.currentWeatherErrorSignal.asReadonly();
  readonly currentWeatherStatus = computed<RequestStatus>(() => {
    if (this.currentWeatherLoadingSignal()) return 'loading';
    if (this.currentWeatherErrorSignal()) return 'error';
    if (this.currentWeatherSignal()) return 'success';
    return 'idle';
  });

  readonly forecast = this.forecastSignal.asReadonly();
  readonly forecastError = this.forecastErrorSignal.asReadonly();
  readonly forecastStatus = computed<RequestStatus>(() => {
    if (this.forecastLoadingSignal()) return 'loading';
    if (this.forecastErrorSignal()) return 'error';
    if (this.forecastSignal()) return 'success';
    return 'idle';
  });

  readonly localWeather = this.localWeatherSignal.asReadonly();
  readonly localWeatherError = this.localWeatherErrorSignal.asReadonly();
  readonly localWeatherStatus = computed<RequestStatus>(() => {
    if (this.localWeatherLoadingSignal()) return 'loading';
    if (this.localWeatherErrorSignal()) return 'error';
    if (this.localWeatherSignal()) return 'success';
    return 'idle';
  });

  constructor() {
    // SWITCHMAP ANNULE LA RECHERCHE PRECEDENTE, catchError EMPECHE UNE ERREUR DE FERMER LE FLUX, takeUntilDestroyed DESABONNE A LA DESTRUCTION DU SERVICE
    this.citySearch$
      .pipe(
        map((city) => city.trim()),
        filter((city) => city.length > 0),
        debounceTime(300),
        distinctUntilChanged((previous, current) => previous.toLowerCase() === current.toLowerCase()),
        switchMap((city) => this.getCurrentWeather(city).pipe(catchError(() => of(null)))),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  searchCity(city: string): void {
    this.citySearch$.next(city);
  }

  getCurrentWeather(city: string): Observable<WeatherData> {
    const normalizedCity = city.trim();
    this.currentWeatherLoadingSignal.set(true);
    this.currentWeatherErrorSignal.set(null);

    return this.fetchCurrentWeather(normalizedCity).pipe(
      tap((data) => this.currentWeatherSignal.set(data)),
      catchError((error: unknown) => {
        this.currentWeatherSignal.set(null);
        this.currentWeatherErrorSignal.set(this.toErrorMessage(error));
        return throwError(() => error);
      }),
      finalize(() => this.currentWeatherLoadingSignal.set(false))
    );
  }

  getForecast(city: string): Observable<ForecastData> {
    const normalizedCity = city.trim();
    this.forecastLoadingSignal.set(true);
    this.forecastErrorSignal.set(null);

    return this.fetchForecast(normalizedCity).pipe(
      tap((data) => this.forecastSignal.set(data)),
      catchError((error: unknown) => {
        this.forecastSignal.set(null);
        this.forecastErrorSignal.set(this.toErrorMessage(error));
        return throwError(() => error);
      }),
      finalize(() => this.forecastLoadingSignal.set(false))
    );
  }

  getLocalWeather(city: string): Observable<WeatherData> {
    const normalizedCity = city.trim();
    this.localWeatherLoadingSignal.set(true);
    this.localWeatherErrorSignal.set(null);

    return this.fetchCurrentWeather(normalizedCity).pipe(
      tap((data) => this.localWeatherSignal.set(data)),
      catchError((error: unknown) => {
        this.localWeatherSignal.set(null);
        this.localWeatherErrorSignal.set(this.toErrorMessage(error));
        return throwError(() => error);
      }),
      finalize(() => this.localWeatherLoadingSignal.set(false))
    );
  }

  private fetchCurrentWeather(city: string): Observable<WeatherData> {
    if (this.useFixtures) {
      const fixture = WEATHER_FIXTURES[city.toLowerCase()];
      return fixture ? of(fixture).pipe(delay(400)) : throwError(() => ({ status: 404 }));
    }

    const params = new HttpParams().set('q', city).set('appid', environment.openWeatherApiKey);

    return this.http
      .get<OpenWeatherCurrentResponse>(`${environment.openWeatherBaseUrl}/weather`, { params })
      .pipe(map((response) => this.toWeatherData(response)));
  }

  private fetchForecast(city: string): Observable<ForecastData> {
    if (this.useFixtures) {
      const fixture = getForecastFixture(city.toLowerCase());
      return fixture ? of(fixture).pipe(delay(400)) : throwError(() => ({ status: 404 }));
    }

    const params = new HttpParams().set('q', city).set('appid', environment.openWeatherApiKey);

    return this.http
      .get<OpenWeatherForecastResponse>(`${environment.openWeatherBaseUrl}/forecast`, { params })
      .pipe(map((response) => this.toForecastData(response)));
  }

  private toWeatherData(response: OpenWeatherCurrentResponse): WeatherData {
    return {
      city: response.name,
      country: response.sys.country,
      temperature: kelvinToCelsius(response.main.temp),
      feelsLike: kelvinToCelsius(response.main.feels_like),
      description: response.weather[0]?.description ?? '',
      humidity: response.main.humidity,
      // CONVERTIT LES M/S EN KM/H
      windSpeed: Math.round(response.wind.speed * 3.6),
      icon: response.weather[0]?.icon ?? ''
    };
  }

  private toForecastData(response: OpenWeatherForecastResponse): ForecastData {
    const dailyEntries = response.list.filter((entry) => entry.dt_txt.includes('12:00:00')).slice(0, 5);

    return {
      city: response.city.name,
      country: response.city.country,
      days: dailyEntries.map((entry) => ({
        date: entry.dt_txt.slice(0, 10),
        temperature: kelvinToCelsius(entry.main.temp),
        description: entry.weather[0]?.description ?? '',
        icon: entry.weather[0]?.icon ?? ''
      }))
    };
  }

  private toErrorMessage(error: unknown): string {
    const status =
      error instanceof HttpErrorResponse ? error.status : (error as { status?: number } | null)?.status;

    if (status === 404) {
      return 'Ville introuvable.';
    }

    if (status === 429) {
      return 'Trop de requêtes, veuillez réessayer dans quelques instants.';
    }

    return 'Impossible de récupérer les données météo.';
  }
}
