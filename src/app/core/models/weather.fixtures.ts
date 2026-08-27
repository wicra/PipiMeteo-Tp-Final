import { ForecastData, ForecastDay, WeatherData } from './weather.model';

export const WEATHER_FIXTURES: Record<string, WeatherData> = {
  paris: {
    city: 'Paris',
    country: 'FR',
    temperature: 24,
    feelsLike: 25,
    description: 'Ciel dégagé',
    humidity: 58,
    windSpeed: 12,
    icon: '01d'
  },
  lille: {
    city: 'Lille',
    country: 'FR',
    temperature: 18,
    feelsLike: 17,
    description: 'Nuageux',
    humidity: 70,
    windSpeed: 20,
    icon: '03d'
  },
  tokyo: {
    city: 'Tokyo',
    country: 'JP',
    temperature: 29,
    feelsLike: 32,
    description: 'Pluie légère',
    humidity: 80,
    windSpeed: 15,
    icon: '10d'
  }
};

interface ForecastTemplateEntry {
  temperature: number;
  description: string;
  icon: string;
}

const FORECAST_TEMPLATES: Record<string, ForecastTemplateEntry[]> = {
  paris: [
    { temperature: 21, description: 'Nuageux', icon: '03d' },
    { temperature: 23, description: 'Ensoleillé', icon: '01d' },
    { temperature: 19, description: 'Pluie', icon: '10d' },
    { temperature: 18, description: 'Pluie', icon: '10d' },
    { temperature: 22, description: 'Ensoleillé', icon: '01d' }
  ],
  lille: [
    { temperature: 16, description: 'Pluie', icon: '10d' },
    { temperature: 17, description: 'Nuageux', icon: '03d' },
    { temperature: 15, description: 'Pluie', icon: '10d' },
    { temperature: 18, description: 'Ensoleillé', icon: '01d' },
    { temperature: 19, description: 'Ensoleillé', icon: '01d' }
  ],
  tokyo: [
    { temperature: 30, description: 'Ensoleillé', icon: '01d' },
    { temperature: 31, description: 'Ensoleillé', icon: '01d' },
    { temperature: 28, description: 'Orage', icon: '11d' },
    { temperature: 27, description: 'Pluie', icon: '10d' },
    { temperature: 29, description: 'Nuageux', icon: '03d' }
  ]
};

function buildForecastDays(template: ForecastTemplateEntry[]): ForecastDay[] {
  const today = new Date();

  return template.map((entry, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index + 1);

    return {
      date: date.toISOString().slice(0, 10),
      ...entry
    };
  });
}

export function getForecastFixture(cityKey: string): ForecastData | undefined {
  const weather = WEATHER_FIXTURES[cityKey];
  const template = FORECAST_TEMPLATES[cityKey];

  if (!weather || !template) {
    return undefined;
  }

  return {
    city: weather.city,
    country: weather.country,
    days: buildForecastDays(template)
  };
}
