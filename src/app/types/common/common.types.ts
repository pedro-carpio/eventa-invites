/**
 * Tipos genéricos reutilizables para el proyecto
 * Estos tipos base pueden ser extendidos por tipos específicos de eventos
 */

/**
 * Representa una sección genérica del evento
 * Ejemplo: ubicación, regalos, código de vestimenta, etc.
 */
export type Section = {
  id: string;
  enabled: boolean;
  title: string;
  description?: string;
  icon?: string;
};

/**
 * Representa una actividad o elemento dentro de una sección
 * Ejemplo: paso de itinerario, instrucciones de ubicación
 */
export type Activity = {
  title: string;
  name: string;
  description?: string;
  action?: () => void;
  button?: string;
  icon?: string;
};

/**
 * Representa una imagen en la galería
 */
export type Image = {
  src: string;
  alt: string;
};

/**
 * Representa información de contacto
 */
export type Contact = {
  whatsappNumber?: number;
  email?: string;
  phone?: string;
};

/**
 * Representa la ubicación del evento
 */
export type Venue = {
  name: string;
  address: string;
  city: string;
  country: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  instructions?: string;
};

/**
 * Representa información de compartición (social media, QR, etc.)
 */
export type SharingMetadata = {
  meta: {
    title: string;
    description: string;
    imageUrl?: string;
  };
  template?: string;
};

/**
 * Representa la configuración de diseño del evento
 */
export type DesignConfig = {
  templateId: string;
  colorScheme?: string;
  galleryImages?: Image[];
  fontPair?: {
    heading: string;
    body: string;
  };
  sharing: SharingMetadata;
};
