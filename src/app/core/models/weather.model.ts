export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface ForecastDay {
  date: string;
  temperature: number;
  description: string;
  icon: string;
}

export interface ForecastData {
  city: string;
  country: string;
  days: ForecastDay[];
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';
