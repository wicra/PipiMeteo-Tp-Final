import { Component, OnInit, output, signal } from '@angular/core';

const RAIN_DURATION_MS = 1400;
const FADE_DURATION_MS = 600;
const DROP_COUNT = 90;

export interface Raindrop {
  left: number;
  duration: number;
  delay: number;
  height: number;
  opacity: number;
}

function createRaindrop(): Raindrop {
  return {
    left: Math.random() * 100,
    duration: 0.5 + Math.random() * 0.7,
    delay: Math.random() * 2,
    height: 12 + Math.random() * 22,
    opacity: 0.35 + Math.random() * 0.55,
  };
}

@Component({
  selector: 'app-rain-splash',
  imports: [],
  templateUrl: './rain-splash.html',
  styleUrl: './rain-splash.css',
})
export class RainSplash implements OnInit {
  protected readonly fadingOut = signal(false);
  protected readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  protected readonly drops: Raindrop[] = Array.from({ length: DROP_COUNT }, createRaindrop);

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
