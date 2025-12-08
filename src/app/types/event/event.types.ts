import { Contact, Venue, DesignConfig } from '../common/common.types';

/**
 * Tipo base para todos los eventos
 * Define la estructura común que comparten todos los tipos de eventos
 * (Baby Shower, Wedding, Birthday, etc.)
 */
export type Event = {
  // Información básica del evento
  title: string;
  subtitle: string;
  description?: string;
  date: Date;
  durationHours?: number;
  timezone: string;

  // Información del anfitrión (neutro en género)
  hostName: string;

  // Ubicación
  venue: Venue;

  // Contacto
  contact?: Contact;

  // Información visual
  photoUrl?: string;

  // Secciones del evento (configurables)
  sections: Record<string, any>;

  // Diseño y compartición
  design: DesignConfig;

  // Metadatos opcionales
  instagramTag?: string;
  metadata?: Record<string, any>;
};

/**
 * Función de utilidad para validar que un objeto es un Event válido
 */
export function isValidEvent(obj: unknown): obj is Event {
  if (typeof obj !== 'object' || obj === null) return false;

  const event = obj as Record<string, unknown>;
  return (
    typeof event['title'] === 'string' &&
    typeof event['subtitle'] === 'string' &&
    event['date'] instanceof Date &&
    typeof event['hostName'] === 'string' &&
    typeof event['venue'] === 'object' &&
    typeof event['design'] === 'object'
  );
}
