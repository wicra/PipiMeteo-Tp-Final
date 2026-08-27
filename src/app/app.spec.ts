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

  it('should hide the splash once finished', () => {
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    fixture.componentInstance['onSplashFinished']();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-rain-splash')).toBeNull();
  });

  it('should show the splash again on every fresh page load', () => {
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    fixture.componentInstance['onSplashFinished']();
    fixture.detectChanges();

    const secondLoad = TestBed.createComponent(App);
    secondLoad.detectChanges();

    expect(secondLoad.nativeElement.querySelector('app-rain-splash')).not.toBeNull();
  });
});
