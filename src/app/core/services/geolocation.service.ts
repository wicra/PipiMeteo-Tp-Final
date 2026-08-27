import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, finalize, map, tap, throwError } from 'rxjs';

const GEOLOCATION_API_URL = 'https://ip-geolocation-api-31u6.onrender.com/geolocate/me';

interface IpGeolocationResponse {
  ip: string;
  country_code: string;
  country_name: string;
  continent: string;
  city: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  timezone: string;
  accuracy_radius_km: number;
}

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  private readonly http = inject(HttpClient);

  private readonly citySignal = signal<string | null>(null);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal(false);

  readonly city = this.citySignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  getLocalCity(): Observable<string> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<IpGeolocationResponse>(GEOLOCATION_API_URL).pipe(
      map((response) => response.city),
      tap((city) => this.citySignal.set(city)),
      catchError((error: unknown) => {
        this.citySignal.set(null);
        this.errorSignal.set('Impossible de localiser votre position.');
        return throwError(() => error);
      }),
      finalize(() => this.loadingSignal.set(false)),
    );
  }
}
