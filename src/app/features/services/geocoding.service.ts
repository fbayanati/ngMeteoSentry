import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { GeoLocation } from '../../core/models';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  private readonly API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

  constructor(private http: HttpClient) {}

  searchLocations(query: string): Observable<GeoLocation[]> {
    if (!query.trim()) return of([]);

    return this.http
      .get<{ results: GeoLocation[] }>(this.API_URL, {
        params: {
          name: query,
          count: 10,
          language: 'en',
          format: 'json',
        },
      })
      .pipe(
        catchError(() => of({ results: [] })),
        map((response: { results: GeoLocation[] }) => response.results ?? []),
        map((results: GeoLocation[]) =>
          results.map((location: GeoLocation) => ({
            ...location,
            admin1: location.admin1,
          }))
        )
      );
  }
}
