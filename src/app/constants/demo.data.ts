import { BabyShower } from '../types/event/baby-shower.types';

/**
 * Datos de demostración para Baby Shower
 *
 * NOTA IMPORTANTE: Datos completamente neutrales en cuanto a género.
 * - hostName: nombre del anfitriód/a (puede ser cualquier persona)
 * - babyName: nombre del bebé (el sujeto del evento)
 * - No se asumen relaciones de género entre el anfitriód y el bebé
 *
 * Este archivo centraliza todos los datos demo para evitar dispersión
 * y facilita mantenimiento de consistencia en ejemplos.
 */

export const BABY_SHOWER_DEMO: BabyShower = {
  // Información del evento
  title: 'Baby Shower de Sofía',
  subtitle: 'Celebrando una llegada muy especial',
  hostName: 'Anfitriód', // ✅ Neutro en género
  babyName: 'Sofía', // ✅ Nombre del bebé (sujeto del evento)

  // Información básica
  date: getEventDate(40), // 40 días desde hoy
  durationHours: 3,
  timezone: 'America/La_Paz',

  // Contacto (camelCase según common.types)
  contact: {
    whatsappNumber: 5917123456789,
  },

  // Invitados
  guests: ['Juan Pérez', 'María Gómez', 'Ana López'],

  // Ubicación
  venue: {
    name: 'Salón Central',
    address: 'Calle Falsa 123',
    city: 'La Paz',
    country: 'Bolivia',
    latitude: -16.4958764,
    longitude: -68.1344558,
    instructions: 'Estacionamiento disponible en la entrada principal.',
  },

  // Instagram para el evento
  instagramTag: 'BabyShower2025',

  // Secciones específicas del Baby Shower
  sections: {
    notes: {
      enabled: true,
      title: 'Notas importantes',
      content: [
        { icon: 'info', text: 'Por favor, confirma tu asistencia 10 días antes del evento' },
        { icon: 'cake', text: 'Habrá pastel y bebidas sin alcohol' },
        { icon: 'car_crash', text: 'El estacionamiento será en la entrada principal.' },
      ],
    },

    foodDetails: {
      enabled: true,
      title: 'Detalles de la comida',
      content: 'Habrá opciones veganas y sin gluten',
    },

    locationDetails: {
      enabled: true,
      title: 'Detalles de la ubicación',
      content: 'El trufi XYZ pasa muy cerca del lugar del evento.',
    },

    rsvp: {
      enabled: true,
      title: 'Confirma tu asistencia',
      deadline: getEventDate(35),
      contactWhatsapp: 5917123456789,
      maxPlusOnes: 1,
      fields: [
        {
          name: 'Juan Pérez',
          attending: true,
        },
        {
          name: 'María Gómez',
          attending: false,
          notes: 'No podré asistir, pero te deseo lo mejor.',
        },
        {
          name: 'Ana López',
          phone: '+5917012345678',
          attending: true,
          notes: 'Llevaré a Carlos también.',
        },
        {
          name: 'Carlos Fernández',
          attending: true,
        },
      ],
    },

    gift: {
      enabled: true,
      title: 'Regalos',
      subtitle: 'Si deseas hacerme un regalo, aquí tienes algunas ideas:',
      enabledCollectiveGift: true,
      ideas: [
        {
          imgUrl: 'https://placehold.co/150',
          title: 'Pañales',
          link: 'https://www.example.com/diapers',
        },
        {
          imgUrl: 'https://placehold.co/150',
          title: 'Ropita para bebé',
          link: 'https://www.example.com/baby-clothes',
        },
        {
          imgUrl: 'https://placehold.co/150',
          title: 'Juguetes educativos',
          link: 'https://www.example.com/educational-toys',
        },
      ],
      paymentQrCodeUrl: 'https://placehold.co/150',
      paymentQrCodeInstructions: 'Escanea el código QR para contribuir con un regalo o aportación.',
      giftListUrl:
        'https://www.casaideas.com.bo/customer/event/event-details/baby-shower-de-sofia-263',
      giftListTag: 'También tengo una lista de Casa Ideas',
      instructions: 'Puedes traer un regalo hecho a mano, ¡lo amaremos aún más!',
      collectiveGiftTitle: 'Regalo Colectivo',
      collectiveGiftDescription: 'Estamos haciendo vaquita para comprar todo de las listas',
      collectiveGiftButtonTag: 'Unirme al regalo colectivo',
    },

    dressCode: {
      enabled: true,
      title: 'Dress code',
      description: 'Puedes venir como quieras ❤️',
    },

    gallery: {
      enabled: true,
      title: 'Galería de fotos',
      description: 'Momentos especiales',
      images: [
        {
          src: 'https://placehold.co/600x400',
          alt: 'Momento especial 1',
        },
        {
          src: 'https://placehold.co/600x400',
          alt: 'Momento especial 2',
        },
        {
          src: 'https://placehold.co/600x400',
          alt: 'Momento especial 3',
        },
      ],
    },

    instagram: {
      enabled: true,
      title: 'Comparte tus fotos y videos',
      description: 'Comparte tus fotos usando',
      tag: 'BabyShower2025',
    },

    sharing: {
      enabled: true,
      title: 'Comparte este evento',
      description: 'Invita a más gente a celebrar con nosotros',
    },
  },

  // Configuración de diseño (camelCase según DesignConfig)
  design: {
    templateId: 'vinculo-natural',
    galleryImages: [
      {
        src: 'https://placehold.co/600x400',
        alt: 'Momento especial 1',
      },
      {
        src: 'https://placehold.co/600x400',
        alt: 'Momento especial 2',
      },
      {
        src: 'https://placehold.co/600x400',
        alt: 'Momento especial 3',
      },
    ],
    sharing: {
      meta: {
        title: '¡Únete a este Baby Shower!',
        description: 'Nos emociona celebrar la llegada de Sofía contigo. ¡No faltes!',
        imageUrl: 'https://placehold.co/600x400',
      },
      template:
        '¡Hola! Te invitamos a este Baby Shower. Será una celebración especial para dar la bienvenida a Sofía. ¡Esperamos verte allí!',
    },
  },
};

/**
 * Utilidad: obtener fecha del evento
 * @param daysFromNow Número de días a partir de hoy
 */
function getEventDate(daysFromNow: number): Date {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysFromNow);
}

/**
 * Genera datos demo dinámicos para diferentes escenarios
 * Útil para pruebas y desarrollo
 */
export function generateBabyShowerDemo(overrides?: Partial<BabyShower>): BabyShower {
  return {
    ...BABY_SHOWER_DEMO,
    ...overrides,
  };
}
