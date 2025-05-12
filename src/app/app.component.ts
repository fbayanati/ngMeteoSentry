import { Component } from '@angular/core';
import { WeatherComponent } from './features/weather/weather.component';
import * as Sentry from '@sentry/angular';
import { LocationSearchComponent } from './features/location-search/location-search.component';
import { GeoLocation } from './core/models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WeatherComponent, Sentry.TraceModule, LocationSearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ngSentry';
  geoLocation: GeoLocation | undefined;

  handleLocationSelection(geoLocation: GeoLocation) {
    this.geoLocation = geoLocation;
  }
}
