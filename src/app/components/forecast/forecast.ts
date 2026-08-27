import { Component, input } from '@angular/core';

import { ForecastData } from '../../core/models/weather.model';

@Component({
  selector: 'app-forecast',
  imports: [],
  templateUrl: './forecast.html',
  styleUrl: './forecast.css',
})
export class Forecast {
  readonly forecast = input.required<ForecastData>();

  protected formatDayName(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  }
}