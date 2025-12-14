import { Event } from './event.types';
import { Image } from '../common/common.types';

/**
 * Secciones específicas de Baby Shower
 */
export type BabyShowerSections = {
  dressCode?: {
    enabled: boolean;
    title?: string;
    description?: string;
  };
  foodDetails?: {
    enabled: boolean;
    title?: string;
    content?: string;
  };
  locationDetails?: {
    enabled: boolean;
    title?: string;
    content?: string;
  };
  notes?: {
    enabled: boolean;
    title: string;
    content: Array<{ icon: string; text: string }>;
  };
  rsvp?: {
    enabled: boolean;
    title?: string;
    deadline?: Date;
    contactWhatsapp?: number;
    maxPlusOnes?: number;
    fields: Array<{
      name: string;
      email?: string;
      phone?: string;
      attending: boolean;
      notes?: string;
    }>;
  };
  gift?: {
    enabled: boolean;
    title?: string;
    subtitle?: string;
    enabledCollectiveGift?: boolean;
    ideas?: Array<{
      imgUrl: string;
      title: string;
      link: string;
    }>;
    paymentQrCodeUrl?: string;
    paymentQrCodeInstructions?: string;
    giftListUrl?: string;
    giftListTag?: string;
    instructions?: string;
    collectiveGiftTitle?: string;
    collectiveGiftDescription?: string;
    collectiveGiftButtonTag?: string;
  };
  gallery?: {
    enabled: boolean;
    title?: string;
    description?: string;
    images?: Image[];
  };
  instagram?: {
    enabled: boolean;
    title?: string;
    description?: string;
    tag?: string;
  };
  sharing?: {
    enabled: boolean;
    title?: string;
    description?: string;
  };
};

/**
 * BabyShower extiende Event base
 * Añade propiedades específicas para eventos de Baby Shower
 */
export type BabyShower = Event & {
  // Información específica del bebé
  babyName: string;
  guests: string[];

  // Secciones específicas de Baby Shower
  sections: Event['sections'] & BabyShowerSections;
};
/**
 * Función de utilidad para validar BabyShower
 */
export function isValidBabyShower(obj: unknown): obj is BabyShower {
  if (typeof obj !== 'object' || obj === null) return false;

  const event = obj as Record<string, unknown>;
  return (
    typeof event['title'] === 'string' &&
    typeof event['babyName'] === 'string' &&
    Array.isArray(event['guests'])
  );
}
