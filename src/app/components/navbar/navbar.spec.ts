import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { Navbar } from './navbar';

@Component({ template: '' })
class StubPage {}

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideRouter([
          { path: 'home', component: StubPage },
          { path: 'weather/:city', component: StubPage },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide the search bar on the home page', async () => {
    await router.navigateByUrl('/home');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-search')).toBeNull();
  });

  it('should show the search bar outside the home page', async () => {
    await router.navigateByUrl('/weather/Paris');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-search')).not.toBeNull();
  });
});
