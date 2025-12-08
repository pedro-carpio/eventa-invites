import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OpenStreetMapsService implements MapsService {
  getMap(latitude: number, longitude: number, zoom: number): void {
    // TODO: Implementation here
  }

  getCoordinates() {
    // TODO: Implementation here
  }
}

export interface MapsService {
  getMap(latitude: number, longitude: number, zoom: number): void;
  //TODO: Define the method to get coordinates
  getCoordinates(): void;
}
