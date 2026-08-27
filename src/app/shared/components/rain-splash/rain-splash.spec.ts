import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { RainSplash } from './rain-splash';

describe('RainSplash', () => {
  let fixture: ComponentFixture<RainSplash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RainSplash],
    }).compileComponents();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    window.matchMedia = vi
      .fn()
      .mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia;
    fixture = TestBed.createComponent(RainSplash);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should emit "finished" immediately when reduced motion is preferred', () => {
    window.matchMedia = vi
      .fn()
      .mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia;
    fixture = TestBed.createComponent(RainSplash);
    const finishedSpy = vi.fn();
    fixture.componentInstance.finished.subscribe(finishedSpy);

    fixture.detectChanges();

    expect(finishedSpy).toHaveBeenCalledTimes(1);
  });

  it('should fade out then emit "finished" after the animation duration', () => {
    vi.useFakeTimers();
    window.matchMedia = vi
      .fn()
      .mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia;
    fixture = TestBed.createComponent(RainSplash);
    const finishedSpy = vi.fn();
    fixture.componentInstance.finished.subscribe(finishedSpy);

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.rain-splash--fading')).toBeNull();
    expect(finishedSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1400);
    fixture.detectChanges();
    expect(compiled.querySelector('.rain-splash--fading')).not.toBeNull();
    expect(finishedSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(600);
    expect(finishedSpy).toHaveBeenCalledTimes(1);
  });
});
