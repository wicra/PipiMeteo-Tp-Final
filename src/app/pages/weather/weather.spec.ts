import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { Weather } from './weather';

describe('Weather', () => {
  let component: Weather;
  let fixture: ComponentFixture<Weather>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Weather],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ city: 'Paris' })) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Weather);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
