import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { Weather } from './weather';
import { WeatherService } from '../../core/services/weather.service';
import { WEATHER_FIXTURES, getForecastFixture } from '../../core/models/weather.fixtures';

describe('Weather', () => {
  let component: Weather;
  let fixture: ComponentFixture<Weather>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Weather],
      providers: [
        {
          provide: WeatherService,
          useValue: {
            currentWeather: signal(null),
            currentWeatherStatus: signal('idle'),
            currentWeatherError: signal(null),
            forecast: signal(null),
            forecastStatus: signal('idle'),
            forecastError: signal(null),
            getCurrentWeather: vi.fn().mockReturnValue(of(WEATHER_FIXTURES['paris'])),
            getForecast: vi.fn().mockReturnValue(of(getForecastFixture('paris')!)),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ city: 'Paris' })) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Weather);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read the city from the route', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.weather__city')?.textContent).toContain('Paris');
  });

  it('should call getCurrentWeather on init', () => {
    const weatherService = TestBed.inject(WeatherService);
    expect(weatherService.getCurrentWeather).toHaveBeenCalledWith('Paris');
  });

  it('should call getForecast on init', () => {
    const weatherService = TestBed.inject(WeatherService);
    expect(weatherService.getForecast).toHaveBeenCalledWith('Paris');
  });
});