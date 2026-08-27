import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from './components/navbar/navbar';
import { RainSplash } from './shared/components/rain-splash/rain-splash';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, RainSplash],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly showSplash = signal(true);

  protected onSplashFinished(): void {
    this.showSplash.set(false);
  }
}
