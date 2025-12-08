import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface Venue {
  name: string;
  address: string;
  city: string;
  country: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  instructions?: string;
}

@Component({
  selector: 'app-location-modal',
  imports: [],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold">{{ venue()?.name || 'Ubicación' }}</h2>
        <button (click)="onClose()" class="text-gray-500 hover:text-gray-700">
          <span class="material-symbols-rounded">close</span>
        </button>
      </div>

      <div class="space-y-2">
        <p class="font-medium">{{ venue()?.name }}</p>
        <p class="text-gray-600">{{ venue()?.address }}, {{ venue()?.city }}</p>
        @if (venue()?.instructions) {
          <p class="text-sm text-gray-500">{{ venue()?.instructions }}</p>
        }
      </div>

      <!-- TODO: Implementar aquí el mapa de open street maps -->
      <div class="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
        <span class="text-gray-500">Mapa próximamente</span>
      </div>

      <div class="flex gap-2">
        <button (click)="openMap()" class="btn btn-primary flex-1">Ver en mapa</button>
        <button (click)="onClose()" class="btn btn-outline">Cerrar</button>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationModal {
  venue = input<Venue>();
  close = output<void>();

  openMap() {
    const venueData = this.venue();
    if (venueData?.latitude && venueData?.longitude) {
      const url = `https://www.google.com/maps?q=${venueData.latitude},${venueData.longitude}`;
      window.open(url, '_blank');
    } else {
      const query = encodeURIComponent(`${venueData?.address}, ${venueData?.city}`);
      const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
      window.open(url, '_blank');
    }
  }

  onClose() {
    this.close.emit();
  }
}
