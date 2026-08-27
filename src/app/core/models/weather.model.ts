// INTERFACES PARTAGEES POUR L'APPLICATION METEO
// Ces interfaces sont utilisees par tous les developpeurs

// Donnees meteo actuelles pour une ville
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

// Donnees de prevision pour un jour
export interface ForecastDay {
  date: string;
  temperature: number;
  feelsLike: number;
  minTemp: number;
  maxTemp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

// Donnees de prevision sur 5 jours
export interface ForecastData {
  city: string;
  country: string;
  list: ForecastDay[];
}

// Etat de la requete API
export type RequestState = 'idle' | 'loading' | 'success' | 'error';

// Structure pour gerer l'etat et les donnees dans les composants
export interface WeatherState {
  state: RequestState;
  data: WeatherData | null;
  error: string | null;
}

export interface ForecastState {
  state: RequestState;
  data: ForecastData | null;
  error: string | null;
}
