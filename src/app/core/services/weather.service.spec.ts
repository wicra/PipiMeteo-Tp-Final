import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService } from './weather.service';
import { WeatherData, ForecastData } from '../models/weather.model';
import { mockWeatherData, mockForecastData, getMockWeather, getMockForecast } from '../models/weather.fixture';

// Mock de l'environnement pour les tests
jest.mock('../../../environment', () => ({
  environment: {
    openWeatherApiKey: 'test-api-key',
    openWeatherBaseUrl: 'https://api.openweathermap.org/data/2.5'
  }
}));

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService]
    });

    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ============================================
  // TESTS : MODE FIXTURE (par defaut)
  // ============================================

  describe('Mode Fixture (par defaut)', () => {

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('getWeather devrait retourner des donnees fictives pour Paris', (done) => {
      service.getWeather('Paris').subscribe((data: WeatherData) => {
        expect(data.city).toBe('Paris');
        expect(data.country).toBe('FR');
        expect(data.temperature).toBe(22.5);
        expect(data.description).toBe('Ciel clair');
        done();
      });
    });

    it('getWeather devrait retourner des donnees fictives pour Lyon', (done) => {
      service.getWeather('Lyon').subscribe((data: WeatherData) => {
        expect(data.city).toBe('Lyon');
        expect(data.country).toBe('FR');
        expect(data.temperature).toBe(22.5);
        done();
      });
    });

    it('getForecast devrait retourner des previsions fictives pour Paris', (done) => {
      service.getForecast('Paris').subscribe((data: ForecastData) => {
        expect(data.city).toBe('Paris');
        expect(data.country).toBe('FR');
        expect(data.list.length).toBe(5);
        expect(data.list[0].temperature).toBe(22.5);
        done();
      });
    });

    it('getWeather devrait retourner des donnees d erreur pour une ville inconnue', (done) => {
      service.getWeather('UnknownCity').subscribe((data: WeatherData) => {
        expect(data.city).toBe('UnknownCity');
        expect(data.country).toBe('');
        expect(data.temperature).toBe(0);
        done();
      });
    });

    it('setFixtureMode devrait permettre de desactiver le mode fixture', () => {
      service.setFixtureMode(false);
      expect(service).toBeTruthy(); // Verifie que le service est toujours valide
    });

  });

  // ============================================
  // TESTS : MODE HTTP (quand useFixture = false)
  // ============================================

  describe('Mode HTTP (quand useFixture = false)', () => {

    beforeEach(() => {
      service.setFixtureMode(false);
    });

    it('getWeather devrait faire un appel HTTP pour la meteo actuelle', () => {
      const testCity = 'Paris';
      const mockResponse = {
        name: testCity,
        sys: { country: 'FR' },
        main: { temp: 295.15, feels_like: 296.15, humidity: 65 },
        wind: { speed: 12.3 },
        weather: [{ description: 'Ciel clair', icon: '01d' }]
      };

      service.getWeather(testCity).subscribe((data: WeatherData) => {
        expect(data.city).toBe(testCity);
        expect(data.country).toBe('FR');
        expect(data.temperature).toBe(22.0); // 295.15K = 22.0°C
        expect(data.feelsLike).toBe(23.0);  // 296.15K = 23.0°C
        expect(data.humidity).toBe(65);
        expect(data.windSpeed).toBe(12.3);
        expect(data.icon).toBe('01d');
      });

      const req = httpMock.expectOne(
        `${service['baseUrl']}/weather?q=${testCity}&appid=${service['apiKey']}&lang=fr`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('getForecast devrait faire un appel HTTP pour les previsions', () => {
      const testCity = 'Paris';
      const mockResponse = {
        city: { name: testCity, country: 'FR' },
        list: [
          {
            dt: 1234567890,
            dt_txt: '2026-08-28 12:00:00',
            main: { temp: 295.15, feels_like: 294.15, temp_min: 293.15, temp_max: 297.15, humidity: 70 },
            wind: { speed: 10.0 },
            weather: [{ description: 'Quelques nuages', icon: '02d' }]
          },
          {
            dt: 1234567891,
            dt_txt: '2026-08-29 12:00:00',
            main: { temp: 293.15, feels_like: 292.15, temp_min: 291.15, temp_max: 295.15, humidity: 75 },
            wind: { speed: 8.0 },
            weather: [{ description: 'Pluie legere', icon: '10d' }]
          }
        ]
      };

      service.getForecast(testCity).subscribe((data: ForecastData) => {
        expect(data.city).toBe(testCity);
        expect(data.country).toBe('FR');
        expect(data.list.length).toBe(2);
        expect(data.list[0].temperature).toBe(22.0);
        expect(data.list[0].date).toBe('2026-08-28');
        expect(data.list[1].temperature).toBe(20.0);
      });

      const req = httpMock.expectOne(
        `${service['baseUrl']}/forecast?q=${testCity}&appid=${service['apiKey']}&lang=fr&cnt=5`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

  });

  // ============================================
  // TESTS : GESTION DES ERREURS
  // ============================================

  describe('Gestion des erreurs', () => {

    beforeEach(() => {
      service.setFixtureMode(false);
    });

    it('devrait retourner "Ville introuvable." pour une erreur 404', (done) => {
      const testCity = 'VilleInexistante';

      service.getWeather(testCity).subscribe({
        error: (error) => {
          expect(error.message).toBe('Ville introuvable.');
          done();
        }
      });

      const req = httpMock.expectOne(
        `${service['baseUrl']}/weather?q=${testCity}&appid=${service['apiKey']}&lang=fr`
      );
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('devrait retourner "Cle API invalide." pour une erreur 401', (done) => {
      service.getWeather('Paris').subscribe({
        error: (error) => {
          expect(error.message).toBe('Cle API invalide.');
          done();
        }
      });

      const req = httpMock.expectOne(
        `${service['baseUrl']}/weather?q=Paris&appid=${service['apiKey']}&lang=fr`
      );
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('devrait retourner "Trop de requetes..." pour une erreur 429', (done) => {
      service.getWeather('Paris').subscribe({
        error: (error) => {
          expect(error.message).toBe('Trop de requetes, veuillez reessayer dans quelques instants.');
          done();
        }
      });

      const req = httpMock.expectOne(
        `${service['baseUrl']}/weather?q=Paris&appid=${service['apiKey']}&lang=fr`
      );
      req.flush('Too Many Requests', { status: 429, statusText: 'Too Many Requests' });
    });

    it('devrait retourner un message d erreur reseau pour une erreur client', (done) => {
      service.getWeather('Paris').subscribe({
        error: (error) => {
          expect(error.message).toBe('Erreur reseau. Verifiez votre connexion.');
          done();
        }
      });

      const req = httpMock.expectOne(
        `${service['baseUrl']}/weather?q=Paris&appid=${service['apiKey']}&lang=fr`
      );
      req.error(new ErrorEvent('Network error'));
    });

    it('devrait retourner "Cle API OpenWeather non configuree" si apiKey est vide', (done) => {
      // Simuler un service avec apiKey vide
      const serviceWithoutKey = TestBed.inject(WeatherService);
      serviceWithoutKey['apiKey'] = '';
      serviceWithoutKey.setFixtureMode(false);

      serviceWithoutKey.getWeather('Paris').subscribe({
        error: (error) => {
          expect(error.message).toBe('Cle API OpenWeather non configuree');
          done();
        }
      });
    });

  });

  // ============================================
  // TESTS : FONCTIONS PRIVEES
  // ============================================

  describe('Fonctions privees', () => {

    it('kelvinToCelsius devrait convertir correctement', () => {
      // @ts-ignore - Acces a la methode privee pour les tests
      const result1 = service.kelvinToCelsius(273.15); // 0°C
      const result2 = service.kelvinToCelsius(295.15); // 22°C
      const result3 = service.kelvinToCelsius(373.15); // 100°C
      const result4 = service.kelvinToCelsius(0);      // -273.15°C

      expect(result1).toBe(0);
      expect(result2).toBe(22);
      expect(result3).toBe(100);
      expect(result4).toBe(-273.15);
    });

    it('mapCurrentWeather devrait mapper correctement la reponse API', () => {
      const mockResponse = {
        name: 'TestCity',
        sys: { country: 'TC' },
        main: { temp: 300.0, feels_like: 301.0, humidity: 80 },
        wind: { speed: 15.5 },
        weather: [{ description: 'Test description', icon: 'test-icon' }]
      };

      // @ts-ignore - Acces a la methode privee pour les tests
      const result = service.mapCurrentWeather(mockResponse);

      expect(result.city).toBe('TestCity');
      expect(result.country).toBe('TC');
      expect(result.temperature).toBe(26.85); // 300K - 273.15 = 26.85°C
      expect(result.feelsLike).toBe(27.85);   // 301K - 273.15 = 27.85°C
      expect(result.humidity).toBe(80);
      expect(result.windSpeed).toBe(15.5);
      expect(result.description).toBe('Test description');
      expect(result.icon).toBe('test-icon');
    });

    it('mapForecastWeather devrait mapper correctement la reponse API', () => {
      const mockResponse = {
        city: { name: 'TestCity', country: 'TC' },
        list: [
          {
            dt: 1234567890,
            dt_txt: '2026-01-01 12:00:00',
            main: { temp: 300.0, feels_like: 299.0, temp_min: 298.0, temp_max: 302.0, humidity: 70 },
            wind: { speed: 10.0 },
            weather: [{ description: 'Forecast test', icon: 'fc-icon' }]
          }
        ]
      };

      // @ts-ignore - Acces a la methode privee pour les tests
      const result = service.mapForecastWeather(mockResponse);

      expect(result.city).toBe('TestCity');
      expect(result.country).toBe('TC');
      expect(result.list.length).toBe(1);
      expect(result.list[0].date).toBe('2026-01-01');
      expect(result.list[0].temperature).toBe(26.85);
      expect(result.list[0].feelsLike).toBe(25.85);
      expect(result.list[0].minTemp).toBe(24.85);
      expect(result.list[0].maxTemp).toBe(28.85);
      expect(result.list[0].humidity).toBe(70);
    });

  });

});
