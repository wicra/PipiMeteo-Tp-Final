import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    sessionStorage.clear();
    window.matchMedia = vi
      .fn()
      .mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia;

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the rain splash on first load', () => {
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-rain-splash')).not.toBeNull();
  });

  it('should hide the splash and remember it for the session once finished', () => {
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    fixture.componentInstance['onSplashFinished']();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-rain-splash')).toBeNull();
    expect(sessionStorage.getItem('pipimeteo-splash-shown')).toBe('true');
  });

  it('should not show the splash again within the same session', () => {
    sessionStorage.setItem('pipimeteo-splash-shown', 'true');
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-rain-splash')).toBeNull();
  });
});
