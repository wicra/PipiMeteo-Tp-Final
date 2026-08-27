import { Component, input } from '@angular/core';

import { WeatherData } from '../../core/models/weather.model';

@Component({
  selector: 'app-weather-card',
  imports: [],
  templateUrl: './weather-card.html',
  styleUrl: './weather-card.css',
})
export class WeatherCard {
  readonly weather = input.required<WeatherData>();
}