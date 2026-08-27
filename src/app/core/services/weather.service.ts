import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WeatherData, ForecastData, ForecastDay } from '../models/weather.model';
import { getMockWeather, getMockForecast } from '../models/weather.fixture';
import { environment } from '../../../environment';

// Interface pour la reponse brute de l'API OpenWeather (meteo actuelle)
interface OpenWeatherCurrentResponse {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

// Interface pour la reponse brute de l'API OpenWeather (previsions)
interface OpenWeatherForecastResponse {
  city: {
    name: string;
    country: string;
  };
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    wind: {
      speed: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
    dt_txt: string;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  // Mode fixture active par defaut pour le developpement
  // Passez a false pour basculer vers l'API OpenWeather
  private readonly useFixture = true;

  // Configuration OpenWeather depuis environment.ts
  private readonly apiKey = environment.openWeatherApiKey;
  private readonly baseUrl = environment.openWeatherBaseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Recupere les donnees meteo actuelles pour une ville
   * @param city Nom de la ville
   * @returns Observable avec les donnees meteo ou une erreur
   */
  getWeather(city: string): Observable<WeatherData> {
    if (this.useFixture) {
      return of(getMockWeather(city));
    }

    if (!this.apiKey) {
      return throwError(() => new Error('Cle API OpenWeather non configuree'));
    }

    const normalizedCity = city.trim();
    const url = `${this.baseUrl}/weather?q=${normalizedCity}&appid=${this.apiKey}&lang=fr`;

    return this.http.get<OpenWeatherCurrentResponse>(url).pipe(
      map((response) => this.mapCurrentWeather(response)),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  /**
   * Recupere les previsions meteo sur 5 jours pour une ville
   * @param city Nom de la ville
   * @returns Observable avec les previsions ou une erreur
   */
  getForecast(city: string): Observable<ForecastData> {
    if (this.useFixture) {
      return of(getMockForecast(city));
    }

    if (!this.apiKey) {
      return throwError(() => new Error('Cle API OpenWeather non configuree'));
    }

    const normalizedCity = city.trim();
    const url = `${this.baseUrl}/forecast?q=${normalizedCity}&appid=${this.apiKey}&lang=fr&cnt=5`;

    return this.http.get<OpenWeatherForecastResponse>(url).pipe(
      map((response) => this.mapForecastWeather(response)),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  /**
   * Mappe la reponse OpenWeather vers WeatherData
   */
  private mapCurrentWeather(response: OpenWeatherCurrentResponse): WeatherData {
    return {
      city: response.name,
      country: response.sys.country,
      temperature: this.kelvinToCelsius(response.main.temp),
      feelsLike: this.kelvinToCelsius(response.main.feels_like),
      description: response.weather[0]?.description || '',
      humidity: response.main.humidity,
      windSpeed: response.wind.speed,
      icon: response.weather[0]?.icon || '',
    };
  }

  /**
   * Mappe la reponse OpenWeather vers ForecastData
   */
  private mapForecastWeather(response: OpenWeatherForecastResponse): ForecastData {
    const forecastDays: ForecastDay[] = response.list.map((item) => ({
      date: item.dt_txt.split(' ')[0],
      temperature: this.kelvinToCelsius(item.main.temp),
      feelsLike: this.kelvinToCelsius(item.main.feels_like),
      minTemp: this.kelvinToCelsius(item.main.temp_min),
      maxTemp: this.kelvinToCelsius(item.main.temp_max),
      description: item.weather[0]?.description || '',
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      icon: item.weather[0]?.icon || '',
    }));

    return {
      city: response.city.name,
      country: response.city.country,
      list: forecastDays,
    };
  }

  /**
   * Convertit Kelvin en Celsius
   */
  private kelvinToCelsius(kelvin: number): number {
    return Math.round((kelvin - 273.15) * 10) / 10;
  }

  /**
   * Gere les erreurs HTTP et les convertit en messages lisibles
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Impossible de recuperer les donnees meteo.';

    if (error.status === 404) {
      errorMessage = 'Ville introuvable.';
    } else if (error.status === 401) {
      errorMessage = 'Cle API invalide.';
    } else if (error.status === 429) {
      errorMessage = 'Trop de requetes, veuillez reessayer dans quelques instants.';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = 'Erreur reseau. Verifiez votre connexion.';
    }

    return throwError(() => new Error(errorMessage));
  }

  /**
   * Active ou desactive le mode fixture (pour les tests)
   */
  setFixtureMode(enabled: boolean): void {
    // @ts-ignore - Property 'useFixture' is private
    this.useFixture = enabled;
  }
}
