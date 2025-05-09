import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { tap } from 'rxjs';

@Component({
  selector: 'app-weather-info',
  standalone: true,
  templateUrl: './weather-info.component.html',
  styleUrl: './weather-info.component.scss',
})
export class WeatherInfoComponent {
  private http = inject(HttpClient);
  weatherData: any;

  lat = 40.7128; // Example: New York City
  lon = -74.006;
  apiUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor() {
    this.fetchWeather();
  }

  fetchWeather(): void {
    const params = `?latitude=${this.lat}&longitude=${this.lon}&current_weather=true`;
    this.http
      .get<any>(this.apiUrl + params)
      .pipe(
        tap(data => {
          debugger;
          this.weatherData = data.current_weather;
        })
      )
      .subscribe();
  }
}
