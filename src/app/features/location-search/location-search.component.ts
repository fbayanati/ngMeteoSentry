import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeoLocation } from '../../core/models';
import { tap } from 'rxjs';
import { GeocodingService } from '../services/geocoding.service';

@Component({
  selector: 'app-location-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './location-search.component.html',
  styleUrl: './location-search.component.scss',
})
export class LocationSearchComponent {
  @Output() locationSelected = new EventEmitter<GeoLocation>();

  searchQuery = '';
  locations = signal<GeoLocation[]>([]);
  loading = signal(false);
  error = signal(false);

  constructor(private geocodingService: GeocodingService) {}

  search(event: Event) {
    event.preventDefault();
    if (!this.searchQuery.trim()) return;

    this.loading.set(true);
    this.error.set(false);

    this.geocodingService
      .searchLocations(this.searchQuery)
      .pipe(
        tap(results => {
          this.locations.set(results);
          this.loading.set(false);
        })
      )
      .subscribe({
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }

  selectLocation(location: GeoLocation) {
    this.locationSelected.emit(location);
    this.locations.set([]); // Clear results after selection
    this.searchQuery = ''; // Clear search input
  }
}
