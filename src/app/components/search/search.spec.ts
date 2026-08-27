import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { Search } from './search';

describe('Search', () => {
  let component: Search;
  let fixture: ComponentFixture<Search>;
  let router: Router;
  let navigateSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Search],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Search);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show an error before any submission', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[role="alert"]')).toBeNull();
  });

  it('should show "Veuillez saisir une ville." when submitted empty', () => {
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[role="alert"]')?.textContent).toContain(
      'Veuillez saisir une ville.',
    );
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should show the error when the city is only spaces', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const form = compiled.querySelector('form') as HTMLFormElement;
    const input = compiled.querySelector('#city') as HTMLInputElement;

    input.value = '   ';
    input.dispatchEvent(new Event('input'));
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(compiled.querySelector('[role="alert"]')).not.toBeNull();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should hide the error once a city is filled in', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const form = compiled.querySelector('form') as HTMLFormElement;
    const input = compiled.querySelector('#city') as HTMLInputElement;

    form.dispatchEvent(new Event('submit'));
    input.value = 'Paris';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelector('[role="alert"]')).toBeNull();
  });

  it('should navigate to /weather/:city with a trimmed city after a valid submission', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const form = compiled.querySelector('form') as HTMLFormElement;
    const input = compiled.querySelector('#city') as HTMLInputElement;

    input.value = '  Paris  ';
    input.dispatchEvent(new Event('input'));
    form.dispatchEvent(new Event('submit'));

    expect(navigateSpy).toHaveBeenCalledWith(['/weather', 'Paris']);
  });
});
