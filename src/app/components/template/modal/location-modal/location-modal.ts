import { Component } from '@angular/core';

@Component({
  selector: 'app-location-modal',
  imports: [],
  template: `
    <h2>Ubicación</h2>
    <!-- TODO: Implementar aqui el mapa de open street maps -->
    <button (click)="openMap()">Ver en mapa</button>
    <button (click)="close()">Cerrar</button>
  `,
  styles: ``,
})
export class LocationModal {
  openMap() {
    // Lógica para abrir el mapa
  }
  close() {
    // Lógica para cerrar el modal
  }
}
