import { ComponentFixture, TestBed } from '@angular/core/testing';

import { getForecastFixture } from '../../core/models/weather.fixtures';
import { Forecast } from './forecast';

describe('Forecast', () => {
  let component: Forecast;
  let fixture: ComponentFixture<Forecast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forecast],
    }).compileComponents();

    fixture = TestBed.createComponent(Forecast);
    component = fixture.componentInstance;
    const fixtureData = getForecastFixture('paris');
    if (fixtureData) {
      fixture.componentRef.setInput('forecast', fixtureData);
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display 5 forecast days', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const days = compiled.querySelectorAll('.forecast__day');
    expect(days.length).toBe(5);
  });

  it('should display the forecast title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.forecast__title')?.textContent).toContain('Prévisions sur 5 jours');
  });

  it('should display icons with alt text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icons = compiled.querySelectorAll('.forecast__icon');
    expect(icons.length).toBe(5);
    icons.forEach((img) => {
      expect((img as HTMLImageElement).alt).toBeTruthy();
    });
  });
});