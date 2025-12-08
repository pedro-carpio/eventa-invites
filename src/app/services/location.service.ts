import { Injectable, inject } from '@angular/core';
import { Venue } from '../types/common/common.types';
import { GoogleMapsService } from './maps.service';

/**
 * Tipo para una actividad de ubicación
 */
export type LocationActivity = {
  title: string;
  name: string;
  action?: () => void;
  button?: string;
};

/**
 * Configuración de ubicación
 */
export type LocationConfig = {
  venue: Venue;
  enableMapLink?: boolean;
  enableDirections?: boolean;
};

/**
 * Servicio de gestión de ubicaciones
 *
 * Responsabilidades:
 * - Extraer datos de ubicación del evento
 * - Construir actividades para mostrar en itinerario
 * - Abrir mapas y direcciones
 * - Formatear información de venue
 *
 * @example
 * ```typescript
 * const locationService = inject(LocationService);
 * const activities = locationService.getLocationActivities(venue, openMapFn);
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly mapsService = inject(GoogleMapsService);

  /**
   * Obtiene actividades de ubicación para mostrar en itinerario
   *
   * @param venue Datos del venue
   * @param onOpenMap Callback cuando usuario hace clic en "Ver Ubicación"
   * @returns Array de actividades formateadas
   *
   * @example
   * ```typescript
   * const activities = locationService.getLocationActivities(
   *   event.venue,
   *   () => this.openLocationModal()
   * );
   * ```
   */
  getLocationActivities(venue: Venue, onOpenMap?: () => void): LocationActivity[] {
    const activities: LocationActivity[] = [
      {
        title: 'Lugar del evento',
        name: venue.name,
      },
      {
        title: 'Dirección',
        name: `${venue.address}, ${venue.city}`,
        action: onOpenMap,
        button: 'Ver Ubicación',
      },
    ];

    // Agregar estado si disponible
    if (venue.state) {
      activities.push({
        title: 'Estado/Región',
        name: venue.state,
      });
    }

    return activities;
  }

  /**
   * Formatea la dirección completa del venue
   *
   * @param venue Datos del venue
   * @returns Dirección completa formateada
   *
   * @example
   * ```typescript
   * const fullAddress = locationService.getFullAddress(venue);
   * // "Calle Principal 123, Madrid, España"
   * ```
   */
  getFullAddress(venue: Venue): string {
    const parts = [venue.address, venue.city];

    if (venue.state) {
      parts.push(venue.state);
    }

    parts.push(venue.country);

    return parts.filter(Boolean).join(', ');
  }

  /**
   * Obtiene la URL del mapa para el venue
   *
   * @param venue Datos del venue
   * @returns URL para Google Maps
   *
   * @example
   * ```typescript
   * const mapUrl = locationService.getMapUrl(venue);
   * // https://maps.google.com?q=40.7128,-74.0060&z=15
   * ```
   */
  getMapUrl(venue: Venue): string {
    // Si tiene coordenadas exactas, usar esas
    if (venue.latitude !== undefined && venue.longitude !== undefined) {
      return this.mapsService.getMapUrl(venue.latitude, venue.longitude, 17);
    }

    // Sino, buscar por dirección
    return this.mapsService.getMapUrlFromAddress(this.getFullAddress(venue));
  }

  /**
   * Abre el mapa del venue en nueva ventana
   *
   * @param venue Datos del venue
   *
   * @example
   * ```typescript
   * locationService.openVenueMap(venue);
   * // Abre Google Maps en nueva ventana
   * ```
   */
  openVenueMap(venue: Venue): void {
    if (venue.latitude !== undefined && venue.longitude !== undefined) {
      this.mapsService.openMap(venue.latitude, venue.longitude, 17);
    } else {
      const url = this.mapsService.getMapUrlFromAddress(this.getFullAddress(venue));
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Obtiene instrucciones de cómo llegar
   *
   * @param venue Datos del venue
   * @returns Instrucciones si están disponibles
   *
   * @example
   * ```typescript
   * const directions = locationService.getDirections(venue);
   * if (directions) {
   *   console.log(directions);
   * }
   * ```
   */
  getDirections(venue: Venue): string | undefined {
    return venue.instructions;
  }

  /**
   * Valida que el venue tenga datos mínimos requeridos
   *
   * @param venue Datos del venue
   * @returns true si es válido
   *
   * @example
   * ```typescript
   * if (locationService.isValidVenue(venue)) {
   *   // Mostrar ubicación
   * }
   * ```
   */
  isValidVenue(venue: Venue | undefined): boolean {
    if (!venue) {
      return false;
    }

    return !!(venue.name && venue.address && venue.city && venue.country);
  }

  /**
   * Extrae las coordenadas del venue si están disponibles
   *
   * @param venue Datos del venue
   * @returns Coordenadas o null si no están disponibles
   *
   * @example
   * ```typescript
   * const coords = locationService.getCoordinates(venue);
   * if (coords) {
   *   const { latitude, longitude } = coords;
   * }
   * ```
   */
  getCoordinates(venue: Venue): { latitude: number; longitude: number } | null {
    if (venue.latitude !== undefined && venue.longitude !== undefined) {
      return {
        latitude: venue.latitude,
        longitude: venue.longitude,
      };
    }

    return null;
  }

  /**
   * Calcula distancia aproximada entre dos coordenadas (en km)
   * Usa fórmula de Haversine
   *
   * @param lat1 Latitud punto 1
   * @param lon1 Longitud punto 1
   * @param lat2 Latitud punto 2
   * @param lon2 Longitud punto 2
   * @returns Distancia en km
   *
   * @example
   * ```typescript
   * const distance = locationService.calculateDistance(40.7128, -74.0060, 40.7489, -73.9680);
   * // ~5.57 km (Manhattan)
   * ```
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convierte grados a radianes (utilidad interna)
   */
  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
