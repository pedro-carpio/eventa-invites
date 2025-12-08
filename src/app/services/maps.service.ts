import { Injectable } from '@angular/core';

/**
 * Interfaz que define los métodos requeridos para un servicio de mapas
 */
export interface IMapsService {
  /**
   * Obtiene URL para abrir un mapa con coordenadas
   */
  getMapUrl(latitude: number, longitude: number, zoom?: number): string;

  /**
   * Obtiene URL para abrir un mapa con una dirección
   */
  getMapUrlFromAddress(address: string): string;

  /**
   * Abre el mapa en una nueva ventana
   */
  openMap(latitude: number, longitude: number, zoom?: number): void;
}

/**
 * Servicio de mapas usando Google Maps
 */
@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService implements IMapsService {
  private readonly googleMapsBaseUrl = 'https://maps.google.com';

  /**
   * Obtiene URL para Google Maps con coordenadas
   */
  getMapUrl(latitude: number, longitude: number, zoom: number = 15): string {
    return `${this.googleMapsBaseUrl}?q=${latitude},${longitude}&z=${zoom}`;
  }

  /**
   * Obtiene URL para Google Maps con dirección
   */
  getMapUrlFromAddress(address: string): string {
    const encodedAddress = encodeURIComponent(address);
    return `${this.googleMapsBaseUrl}?q=${encodedAddress}`;
  }

  /**
   * Abre el mapa en una nueva ventana
   */
  openMap(latitude: number, longitude: number, zoom: number = 15): void {
    const url = this.getMapUrl(latitude, longitude, zoom);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Servicio de mapas usando OpenStreetMap
 * (Alternativa más privada a Google Maps)
 */
@Injectable()
export class OpenStreetMapsService implements IMapsService {
  private readonly openStreetMapsBaseUrl = 'https://www.openstreetmap.org';

  /**
   * Obtiene URL para OpenStreetMap con coordenadas
   */
  getMapUrl(latitude: number, longitude: number, zoom: number = 15): string {
    return `${this.openStreetMapsBaseUrl}?mlat=${latitude}&mlon=${longitude}&zoom=${zoom}`;
  }

  /**
   * Obtiene URL para OpenStreetMap con dirección
   * (OpenStreetMap requiere buscar primero)
   */
  getMapUrlFromAddress(address: string): string {
    const encodedAddress = encodeURIComponent(address);
    return `${this.openStreetMapsBaseUrl}/search?query=${encodedAddress}`;
  }

  /**
   * Abre el mapa en una nueva ventana
   */
  openMap(latitude: number, longitude: number, zoom: number = 15): void {
    const url = this.getMapUrl(latitude, longitude, zoom);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Factory para crear la instancia correcta del servicio de mapas
 */
@Injectable({
  providedIn: 'root',
})
export class MapsServiceFactory {
  /**
   * Retorna la instancia del servicio de mapas preferido
   * Por defecto: Google Maps (más ampliamente soportado)
   */
  createMapsService(provider: 'google' | 'openstreetmap' = 'google'): IMapsService {
    if (provider === 'openstreetmap') {
      return new OpenStreetMapsService();
    }
    return new GoogleMapsService();
  }
}

/**
 * Alias para compatibilidad hacia atrás
 * @deprecated Usar GoogleMapsService o OpenStreetMapsService directamente
 */
@Injectable({
  providedIn: 'root',
})
export class MapsService extends GoogleMapsService {}
