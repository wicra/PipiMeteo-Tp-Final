import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { RainSplash } from './shared/components/rain-splash/rain-splash';

const SPLASH_SESSION_KEY = 'pipimeteo-splash-shown';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RainSplash],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly showSplash = signal(!sessionStorage.getItem(SPLASH_SESSION_KEY));

  protected onSplashFinished(): void {
    sessionStorage.setItem(SPLASH_SESSION_KEY, 'true');
    this.showSplash.set(false);
  }
}
