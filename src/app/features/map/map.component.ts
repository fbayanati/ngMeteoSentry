import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-geosearch/dist/geosearch.css';
import { CitySearchComponent } from '../city-search/city-search.component';

@Component({
  selector: 'app-map',
  imports: [CitySearchComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  private marker!: L.Marker;

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);
  }

  onCitySelected(location: any): void {
    this.map.setView([location.lat, location.lng], 12);

    const popupContent = `
      <div style="padding: 8px;">
        <strong>${location.name}</strong>
        <div style="margin-top: 4px; font-size: 12px;">
          <div>Lat: ${location.lat.toFixed(4)}</div>
          <div>Lng: ${location.lng.toFixed(4)}</div>
        </div>
      </div>
    `;

    if (this.marker) {
      this.marker.setLatLng([location.lat, location.lng]).setPopupContent(popupContent).openPopup();
    } else {
      this.marker = L.marker([location.lat, location.lng])
        .addTo(this.map)
        .bindPopup(popupContent)
        .openPopup();
    }
  }
}
