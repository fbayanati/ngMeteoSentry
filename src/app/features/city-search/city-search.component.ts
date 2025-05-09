import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-city-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './city-search.component.html',
  styleUrl: './city-search.component.scss',
})
export class CitySearchComponent implements OnInit {
  @Output() citySelected = new EventEmitter<{
    name: string;
    lat: number;
    lng: number;
    address: any;
  }>();

  private provider = new OpenStreetMapProvider();
  private searchTerms = new Subject<string>();

  searchResults: any[] = [];
  isLoading = false;
  searchQuery = '';

  ngOnInit() {
    this.setupSearch();
  }

  private setupSearch() {
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => this.searchCities(term))
      )
      .subscribe({
        next: results => {
          this.searchResults = results;
          this.isLoading = false;
        },
        error: err => {
          console.error('Search error:', err);
          this.isLoading = false;
        },
      });
  }

  private async searchCities(query: string): Promise<any[]> {
    if (!query.trim()) return [];

    this.isLoading = true;
    try {
      return await this.provider.search({ query });
    } catch (error) {
      console.error('Geocoding error:', error);
      return [];
    }
  }

  onSearchInput() {
    this.searchTerms.next(this.searchQuery);
  }

  selectCity(city: any) {
    const location = {
      name: city.label,
      lat: city.y,
      lng: city.x,
      address: city,
    };
    this.citySelected.emit(location);
    this.searchQuery = city.label;
    this.searchResults = [];
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
  }
}
