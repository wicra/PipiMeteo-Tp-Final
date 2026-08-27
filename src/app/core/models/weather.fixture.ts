// DONNEES FICTIVES POUR LE DEVELOPPEMENT
// Utilisees par tous les developpeurs avant l'integration de l'API OpenWeather

import { WeatherData, ForecastData, ForecastDay } from './weather.model';

// Donnees meteo fictives pour Paris
export const mockWeatherData: WeatherData = {
  city: 'Paris',
  country: 'FR',
  temperature: 22.5,
  feelsLike: 24.1,
  description: 'Ciel clair',
  humidity: 65,
  windSpeed: 12.3,
  icon: '01d',
};

// Donnees meteo fictives pour une ville inexistante (pour tests d'erreur)
export const mockWeatherError: WeatherData = {
  city: 'UnknownCity',
  country: '',
  temperature: 0,
  feelsLike: 0,
  description: '',
  humidity: 0,
  windSpeed: 0,
  icon: '',
};

// Donnees de prevision fictives pour Paris (5 jours)
export const mockForecastData: ForecastData = {
  city: 'Paris',
  country: 'FR',
  list: [
    {
      date: '2026-08-28',
      temperature: 22.5,
      feelsLike: 24.1,
      minTemp: 18.0,
      maxTemp: 25.0,
      description: 'Ciel clair',
      humidity: 65,
      windSpeed: 12.3,
      icon: '01d',
    },
    {
      date: '2026-08-29',
      temperature: 20.0,
      feelsLike: 19.5,
      minTemp: 16.0,
      maxTemp: 22.0,
      description: 'Quelques nuages',
      humidity: 70,
      windSpeed: 10.0,
      icon: '02d',
    },
    {
      date: '2026-08-30',
      temperature: 19.5,
      feelsLike: 18.0,
      minTemp: 15.0,
      maxTemp: 21.0,
      description: 'Pluie legere',
      humidity: 80,
      windSpeed: 8.5,
      icon: '10d',
    },
    {
      date: '2026-08-31',
      temperature: 21.0,
      feelsLike: 22.0,
      minTemp: 17.0,
      maxTemp: 24.0,
      description: 'Nuages disperses',
      humidity: 60,
      windSpeed: 14.0,
      icon: '03d',
    },
    {
      date: '2026-09-01',
      temperature: 23.0,
      feelsLike: 25.0,
      minTemp: 19.0,
      maxTemp: 27.0,
      description: 'Ensoleille',
      humidity: 55,
      windSpeed: 9.0,
      icon: '01d',
    },
  ],
};

// Donnees de prevision fictives pour une ville inexistante
export const mockForecastError: ForecastData = {
  city: 'UnknownCity',
  country: '',
  list: [],
};

// Fonction pour obtenir des donnees meteo fictives par ville
export function getMockWeather(city: string): WeatherData {
  const normalizedCity = city.trim().toLowerCase();
  
  if (normalizedCity === 'paris' || normalizedCity === 'lyon' || normalizedCity === 'marseille') {
    return {
      ...mockWeatherData,
      city: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
    };
  }
  
  return mockWeatherError;
}

// Fonction pour obtenir des previsions fictives par ville
export function getMockForecast(city: string): ForecastData {
  const normalizedCity = city.trim().toLowerCase();
  
  if (normalizedCity === 'paris' || normalizedCity === 'lyon' || normalizedCity === 'marseille') {
    return {
      ...mockForecastData,
      city: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
    };
  }
  
  return mockForecastError;
}
