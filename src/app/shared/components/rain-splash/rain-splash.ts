import { Component, OnInit, output, signal } from '@angular/core';

const RAIN_DURATION_MS = 1400;
const FADE_DURATION_MS = 600;

@Component({
  selector: 'app-rain-splash',
  imports: [],
  templateUrl: './rain-splash.html',
  styleUrl: './rain-splash.css',
})
export class RainSplash implements OnInit {
  protected readonly fadingOut = signal(false);
  protected readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  readonly finished = output<void>();

  ngOnInit(): void {
    if (this.reducedMotion) {
      this.finished.emit();
      return;
    }

    setTimeout(() => this.fadingOut.set(true), RAIN_DURATION_MS);
    setTimeout(() => this.finished.emit(), RAIN_DURATION_MS + FADE_DURATION_MS);
  }
}
