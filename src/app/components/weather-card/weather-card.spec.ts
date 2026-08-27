import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WEATHER_FIXTURES } from '../../core/models/weather.fixtures';
import { WeatherCard } from './weather-card';

describe('WeatherCard', () => {
  let component: WeatherCard;
  let fixture: ComponentFixture<WeatherCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherCard],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('weather', WEATHER_FIXTURES['paris']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the city and country', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.weather-card__city')?.textContent).toContain('Paris');
    expect(compiled.querySelector('.weather-card__city')?.textContent).toContain('FR');
  });

  it('should display the temperature', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.weather-card__temperature')?.textContent).toContain('24');
  });

  it('should display the description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.weather-card__description')?.textContent).toContain('Ciel dégagé');
  });

  it('should display the icon with alt text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('.weather-card__icon') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.alt).toBe('Ciel dégagé');
  });

  it('should display humidity and wind speed', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('58%');
    expect(compiled.textContent).toContain('12 km/h');
  });
});