import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-hourly-forecast',
  imports: [CommonModule, MatCardModule, MatTableModule],
  templateUrl: './hourly-forecast.component.html',
  styleUrl: './hourly-forecast.component.scss',
})
export class HourlyForecastComponent {
  @Input({ required: true }) set latitude(latitude: number | undefined) {
    this.#latitude = latitude;
    this.getHourlyWeather();
  }

  #latitude: number | undefined;
  get latitude() {
    return this.#latitude;
  }

  @Input({ required: true }) set longitude(longitude: number | undefined) {
    this.#longitude = longitude;
    this.getHourlyWeather();
  }

  #longitude: number | undefined;
  get longitude() {
    return this.#longitude;
  }

  hourlyData: any;
  forecastData: any[] = [];
  displayedColumns = ['time', 'temperature'];

  constructor(private weatherService: WeatherService) {}

  getHourlyWeather(): void {
    if (this.latitude != null && this.longitude != null)
      this.weatherService.getWeather(this.latitude, this.longitude).subscribe(data => {
        this.hourlyData = data.hourly;
        this.prepareForecastData();
      });
  }

  prepareForecastData(): void {
    for (let i = 0; i < 24; i++) {
      this.forecastData.push({
        time: this.hourlyData.time[i],
        temperature: this.hourlyData.temperature_2m[i],
      });
    }
  }
}
