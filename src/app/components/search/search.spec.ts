import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Search } from './search';

describe('Search', () => {
  let component: Search;
  let fixture: ComponentFixture<Search>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Search],
    }).compileComponents();

    fixture = TestBed.createComponent(Search);
    component = fixture.componentInstance;
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
});
