import { Component } from '@angular/core';

import { Search } from '../../components/search/search';
import { Logo } from '../../shared/components/logo/logo';

@Component({
  selector: 'app-home',
  imports: [Search, Logo],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
