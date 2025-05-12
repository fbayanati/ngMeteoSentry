import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../services/weather.service';
import { FormsModule } from '@angular/forms';
import { HourlyForecastComponent } from '../hourly-forecast/hourly-forecast.component';
import * as Sentry from '@sentry/angular';
import { GeoLocation } from '../../core/models';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule, HourlyForecastComponent, Sentry.TraceModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
@Sentry.TraceClass({ name: 'WeatherComponent' })
export class WeatherComponent implements OnInit, OnDestroy {
  weatherService = inject(WeatherService);
  latitude!: number;
  longitude!: number;

  @Input() set geoLocation(geoLocation: GeoLocation | undefined) {
    if (geoLocation == null) {
      return;
    }

    this.latitude = geoLocation.latitude;
    this.longitude = geoLocation.longitude;
    this.location = geoLocation.name ?? '';

    this.fetchWeather(this.latitude, this.longitude);
  }

  weatherData: any;
  loading = false;
  error: string | null = null;
  location = '';
  useCurrentLocation = true;

  ngOnInit(): void {
    if (this.useCurrentLocation) {
      this.getCurrentLocationWeather();
    }
  }

  weatherLocation(): string {
    return this.location !== '' ? this.location : 'my current location';
  }

  @Sentry.TraceMethod({ name: 'WeatherComponent.getCurrentLocationWeather' })
  getCurrentLocationWeather(): void {
    this.loading = true;
    this.error = null;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.fetchWeather(this.latitude, this.longitude);
        },
        error => {
          this.loading = false;
          this.error = 'Unable to retrieve your location. Using default location.';
          this.fetchWeather(52.52, 13.41);
        }
      );
    } else {
      this.error = 'Geolocation is not supported by your browser. Using default location.';
      this.fetchWeather(52.52, 13.41);
    }
  }

  @Sentry.TraceMethod({ name: 'WeatherComponent.fetchWeather' })
  private fetchWeather(latitude: number, longitude: number): void {
    this.weatherService.getWeather(latitude, longitude).subscribe({
      next: data => {
        this.weatherData = data;
        this.loading = false;
      },
      error: err => {
        console.error('API error:', err);
        this.error = 'Failed to fetch weather data. Please try again later.';
        this.loading = false;
      },
    });
  }

  getWeatherIcon(code: number): string {
    if (code === 0) return '☀️';
    if (code < 4) return '🌤️';
    if (code < 50) return '☁️';
    if (code < 70) return '🌧️';
    if (code < 80) return '❄️';
    if (code < 90) return '🌩️';
    return '🌈';
  }

  getDayName(offset: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + offset);
    return days[targetDate.getDay()];
  }

  formatTime(time: string): string {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  throwTestError(): void {
    throw new Error('Sentry Test Error');
  }

  ngOnDestroy(): void {
    // TODO
  }
}
