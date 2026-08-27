import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WeatherData, ForecastData } from '../models/weather.model';
import { getMockWeather, getMockForecast } from '../models/weather.fixture';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  // Mode fixture active par defaut pour le developpement
  // Desactivez cette ligne pour basculer vers l'API OpenWeather
  private readonly useFixture = true;

  // Configuration OpenWeather depuis environment.ts
  private readonly apiKey = environment.openWeatherApiKey;
  private readonly baseUrl = environment.openWeatherBaseUrl;

  /**
   * Recupere les donnees meteo actuelles pour une ville
   * @param city Nom de la ville
   * @returns Observable avec les donnees meteo ou une erreur
   */
  getWeather(city: string): Observable<WeatherData> {
    if (this.useFixture) {
      return of(getMockWeather(city));
    }
    // TODO: Implemeter l'appel HTTP a OpenWeather
    return of(getMockWeather(city));
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
    // TODO: Implemeter l'appel HTTP a OpenWeather pour les previsions
    return of(getMockForecast(city));
  }

  /**
   * Active ou desactive le mode fixture (pour les tests)
   * @param enabled true pour activer le mode fixture
   */
  setFixtureMode(enabled: boolean): void {
    // @ts-ignore - Property 'useFixture' is private
    this.useFixture = enabled;
  }
}
