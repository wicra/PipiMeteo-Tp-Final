import { Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './logo.html',
  styleUrl: './logo.css',
})
export class Logo {
  readonly size = input(48);
}
