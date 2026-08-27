import { Component } from '@angular/core';

import { Search } from '../../components/search/search';

@Component({
  selector: 'app-home',
  imports: [Search],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
