/**
 * Ejemplo de otro tipo de evento que extiende Event
 * Demuestra la reutilización de la arquitectura
 */

import { Event } from './event.types';

export type Wedding = Event & {
  // Información específica de bodas
  partner1Name: string;
  partner2Name: string;
  guests: string[];

  // Secciones específicas de Wedding
  sections: Event['sections'] & {
    dresscode?: {
      enabled: boolean;
      description?: string;
    };
    honeymoon?: {
      enabled: boolean;
      destination?: string;
      contribution?: {
        enabled: boolean;
        bankDetails?: string;
      };
    };
    registry?: {
      enabled: boolean;
      url?: string;
      items?: Array<{
        title: string;
        link: string;
      }>;
    };
  };
};
