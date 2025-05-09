import { Component } from '@angular/core';
import { WeatherComponent } from './features/weather/weather.component';
import * as Sentry from '@sentry/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WeatherComponent, Sentry.TraceModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ngSentry';
}
