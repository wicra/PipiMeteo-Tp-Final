import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Logo } from './logo';

describe('Logo', () => {
  let component: Logo;
  let fixture: ComponentFixture<Logo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Logo],
    }).compileComponents();

    fixture = TestBed.createComponent(Logo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render an accessible svg with a title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('svg')?.getAttribute('role')).toBe('img');
    expect(compiled.querySelector('title')?.textContent).toContain('PipiMeteo');
  });

  it('should apply the size input to the svg width and height', () => {
    fixture.componentRef.setInput('size', 96);
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg') as SVGElement;
    expect(svg.getAttribute('width')).toBe('96');
    expect(svg.getAttribute('height')).toBe('96');
  });
});
