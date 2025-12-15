import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteService } from '../../../services/invite.service';
import { BabyShower } from '../../../types/event/baby-shower.types';
import { LocationModal } from '../../template/modal/location-modal/location-modal';
import { SharedModalWrapperComponent } from '../../template/modal/shared-modal-wrapper.component';
import { CollectiveQrPayment } from '../../template/modal/collective-qr-payment/collective-qr-payment';
import { GiftsGalleryModal } from '../../template/modal/gifts-gallery-modal/gifts-gallery-modal';

/**
 * ============================================================================
 * MOCK DATA - Baby Shower "Renacuajo" de La Chinita
 * ============================================================================
 *
 * Este objeto contiene toda la data extraída del diseño y comentarios HTML
 * Sirve como source de verdad para la invitación
 */
const BABY_SHOWER_INVITE_MOCK_DATA: BabyShower = {
  // ========== INFORMACIÓN BÁSICA DEL EVENTO ==========
  title: 'Baby Shower de mi pequeño renacuajo',
  subtitle: 'Una fiesta anfibia pre navideña',
  hostName: 'Belén / La Chinita / Mamá Rana',
  babyName: 'mi bebé ❤',
  date: new Date('2025-12-20T17:00:00'), // 20 de diciembre a partir de las 5 pm
  durationHours: 3,
  timezone: 'America/La_Paz',

  // ========== CONTACTO ==========
  contact: {
    whatsappNumber: 59177914381,
    email: undefined, // TODO: Agregar si es necesario
    phone: undefined, // TODO: Agregar si es necesario
  },

  // ========== INVITADOS ==========
  guests: [
    // TODO: Se cargarán dinámicamente desde RSVP
  ],

  // ========== UBICACIÓN DEL EVENTO ==========
  venue: {
    name: 'El país de las maravillas',
    address: 'Casita de Belen', // Pendiente completar
    city: 'Cochabamba',
    country: 'Bolivia',
    state: undefined, // TODO: Agregar si es necesario
    latitude: -17.3925813, // TODO: Agregar coordenadas
    longitude: -66.1182932, // TODO: Agregar coordenadas
    instructions: 'El trufi 43 te deja cerca.', // Pendiente completar
  },

  // ========== CONFIGURACIÓN DE DISEÑO ==========
  instagramTag: 'la_china_supay',

  // ========== DISEÑO (Requerido por tipo Event) ==========
  design: {
    templateId: 'baby-shower-renacuajo',
    colorScheme: 'green', // Verde #7fc29b es el color principal
    fontPair: {
      heading: 'Barriecito',
      body: 'Quicksand',
    },
    sharing: {
      meta: {
        title: 'Baby Shower de mi pequeño renacuajo',
        description:
          'Te invito a celebrar la dulce espera de mi pequeño renacuajo. Una fiesta anfibia pre navideña',
        imageUrl: '/croac.webp',
      },
      template: 'baby-shower',
    },
  },

  // ========== SECCIONES ESPECÍFICAS DEL BABY SHOWER ==========
  sections: {
    // --------- DRESS CODE / TEMÁTICA ---------
    dressCode: {
      enabled: true,
      title: '¿la temática?',
      description: 'VERDE',
      // Para nosotros el verde significa:
      // - vida silvestre
      // - botánica
      // - dinosaurios (esos ya no cuentan como vivos jeje)
      // Te animamos a vestir algo verde o colores neutros si lo deseas
    },

    // --------- DETALLES DE COMIDA ---------
    foodDetails: {
      enabled: true,
      title: 'Información sobre comida y bebidas',
      content:
        'En esta ocasión la comida y bebidas serán bastante naturales y frescas. En caso de querer llevar algo para compartir solo considera que: NO HABRÁ BEBIDAS CON ALCOHOL Y TAMPOCO ÁREAS PARA FUMAR',
    },

    // --------- DETALLES DE UBICACIÓN ---------
    locationDetails: {
      enabled: true,
      title: 'Detalles del lugar',
      content: 'TODO: Detalles específicos de cómo llegar al país de las maravillas',
    },

    // --------- NOTAS IMPORTANTES ---------
    notes: {
      enabled: true,
      title: 'INFORMACIÓN IMPORTANTE',
      content: [
        {
          icon: 'people',
          text: 'Esta invitación te incluye a ti y si gustas un acompañante',
        },
        {
          icon: 'calendar',
          text: 'NO OLVIDES CONFIRMAR TU ASISTENCIA Y/O LA DE TU ACOMPAÑANTE A MÁS TARDAR HASTA EL JUEVES 18 DE DIC',
        },
        {
          icon: 'info',
          text: 'La comida y bebidas serán naturales y frescas - NO habrá alcohol ni áreas para fumar',
        },
      ],
    },

    // --------- RSVP / CONFIRMACIÓN DE ASISTENCIA ---------
    rsvp: {
      enabled: true,
      title: 'Confirma tu asistencia',
      deadline: new Date('2025-12-18'), // Jueves 18 de diciembre
      contactWhatsapp: 59177914381, // Belén/La Chinita
      maxPlusOnes: 1, // Pueden llevar UN acompañante máximo
      fields: [],
      // MENSAJE PERSONALIZADO:
      // "Asistiré al baby shower de La chinita [Quisiera llevar a X persona conmigo!]"
    },

    // --------- REGALOS Y PAGOS COLECTIVOS ---------
    gift: {
      enabled: true,
      title: 'Regalos',
      subtitle: 'Tu presencia será el regalo mas preciado en esta ocasión…',
      enabledCollectiveGift: true,

      // IDEAS DE REGALOS - TODO: Completar con links reales
      ideas: [
        {
          imgUrl: '/croac.webp',
          title: 'Idea 1 de regalo',
          link: 'TODO: Link a tienda',
        },
        {
          imgUrl: '/croac.webp',
          title: 'Idea 2 de regalo',
          link: 'TODO: Link a tienda',
        },
        {
          imgUrl: '/croac.webp',
          title: 'Idea 3 de regalo',
          link: 'TODO: Link a tienda',
        },
      ],

      // QR PARA PAGO COLECTIVO
      paymentQrCodeUrl: 'croac-qr-code.png',
      paymentQrCodeInstructions:
        'Escanea el código QR para contribuir con un regalo o aportación. Lo dejamos a tu cariño ❤',

      // LISTA DE DESEOS EXTERNA
      giftListUrl: 'TODO: Link a lista de deseos',
      giftListTag: 'También tengo una lista de deseos',

      // REGALO COLECTIVO / VAQUITA
      collectiveGiftTitle: 'Regalo Colectivo',
      collectiveGiftDescription:
        'Estamos haciendo vaquita para comprar lo necesario. Lo dejamos a tu cariño ❤',
      collectiveGiftButtonTag: 'Unirme a la vaquita',

      // INSTRUCCIONES FINALES
      instructions: 'Por supuesto puedes traer un REGALO HECHO A MANO ¡lo amaremos aún más!',
    },

    // --------- GALERÍA DE FOTOS ---------
    gallery: {
      enabled: true,
      title: 'Galería de fotos',
      description: 'Momentos especiales del evento',
      images: [
        {
          src: '/croac.webp',
          alt: 'Foto del evento 1',
        },
        {
          src: '/croac.webp',
          alt: 'Foto del evento 2',
        },
        {
          src: '/croac.webp',
          alt: 'Foto del evento 3',
        },
      ],
    },

    // --------- INSTAGRAM TAG ---------
    instagram: {
      enabled: true,
      title: 'Comparte tus fotos',
      description: 'Etiqueta tus fotos con:',
      tag: '#la_china_supay',
    },

    // --------- COMPARTIR INVITACIÓN ---------
    sharing: {
      enabled: true,
      title: 'Comparte esta invitación',
      description: 'Ayúdame a que más personas se enteres del evento',
    },
  },
};

/**
 * Componente de invitación para Baby Shower - Temática "Renacuajo"
 *
 * Implementa el diseño descrito en el pseudocódigo y comentarios HTML con:
 * - Secciones alternadas (izquierda/centro/derecha)
 * - Imágenes decorativas estratégicamente distribuidas
 * - Tipografías y colores consistentes (#7fc29b como acento principal)
 * - Modales para ubicación y pagos colectivos
 * - Countdown del evento con actualización automática cada segundo
 * - Integración con WhatsApp para RSVP con número 59177914381
 *
 * Data source: BABY_SHOWER_INVITE_MOCK_DATA (definido arriba)
 *
 * Basado en patrón VinculoNatural con adaptaciones específicas para baby shower
 */
@Component({
  selector: 'app-invite-demo',
  standalone: true,
  imports: [
    CommonModule,
    LocationModal,
    SharedModalWrapperComponent,
    CollectiveQrPayment,
    GiftsGalleryModal,
  ],
  templateUrl: './invite.html',
  styleUrls: ['./invite.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InviteDemo {
  private readonly inviteService = inject(InviteService);

  // ===== SIGNALS =====
  eventData = signal<BabyShower | undefined>(undefined);
  isLocationModalOpen = signal<boolean>(false);
  isCollectiveQrModalOpen = signal<boolean>(false);
  isGiftsModalOpen = signal<boolean>(false);

  // Señal para forzar actualización del contador (se incrementa cada segundo)
  private readonly currentTime = signal<number>(Date.now());

  // ===== COMPUTED SIGNALS =====
  /**
   * Calcula días faltantes para el evento
   */
  readonly daysRemaining = computed(() => {
    const event = this.eventData();
    // Usar currentTime para forzar recálculo cada segundo
    this.currentTime();
    if (!event) return 0;
    const now = new Date();
    const eventDate = new Date(event.date);
    const diff = eventDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  });

  /**
   * Calcula horas, minutos y segundos faltantes
   * Se actualiza automáticamente cada segundo
   */
  readonly timeRemaining = computed(() => {
    const event = this.eventData();
    // Usar currentTime para forzar recálculo cada segundo
    this.currentTime();
    if (!event) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const now = new Date();
    const eventDate = new Date(event.date);
    const diff = eventDate.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
  });

  /**
   * URL del QR del regalo colectivo
   * Source: BABY_SHOWER_INVITE_MOCK_DATA.sections.gift?.paymentQrCodeUrl
   */
  readonly collectiveQrUrl = computed(() => {
    const event = this.eventData();
    return event?.sections.gift?.paymentQrCodeUrl;
  });

  /**
   * Instrucciones para el QR del regalo colectivo
   * Source: BABY_SHOWER_INVITE_MOCK_DATA.sections.gift?.paymentQrCodeInstructions
   */
  readonly collectiveQrInstructions = computed(() => {
    const event = this.eventData();
    return event?.sections.gift?.paymentQrCodeInstructions;
  });

  /**
   * Número de WhatsApp para contacto
   * Source: BABY_SHOWER_INVITE_MOCK_DATA.contact.whatsappNumber (59177914381)
   * Fallback: BABY_SHOWER_INVITE_MOCK_DATA.sections.rsvp?.contactWhatsapp
   */
  readonly whatsappNumber = computed(() => {
    const event = this.eventData();
    return event?.sections.rsvp?.contactWhatsapp || event?.contact?.whatsappNumber;
  });

  /**
   * Nombre del anfitrión
   * Source: BABY_SHOWER_INVITE_MOCK_DATA.hostName = "Belén / La Chinita / Mamá Rana"
   */
  readonly hostName = computed(() => {
    const event = this.eventData();
    return event?.hostName || 'La Chinita';
  });

  /**
   * Nombre del bebé
   * Source: BABY_SHOWER_INVITE_MOCK_DATA.babyName = "mi bebé ❤"
   */
  readonly babyName = computed(() => {
    const event = this.eventData();
    return event?.babyName || 'mi bebé';
  });

  /**
   * Máximo número de acompañantes permitidos
   * Source: BABY_SHOWER_INVITE_MOCK_DATA.sections.rsvp?.maxPlusOnes = 1
   */
  readonly maxPlusOnes = computed(() => {
    const event = this.eventData();
    return event?.sections.rsvp?.maxPlusOnes || 1;
  });

  /**
   * Fecha límite para confirmación de asistencia
   * Source: BABY_SHOWER_INVITE_MOCK_DATA.sections.rsvp?.deadline = "2025-12-18"
   */
  readonly rsvpDeadline = computed(() => {
    const event = this.eventData();
    return event?.sections.rsvp?.deadline;
  });

  /**
   * Tema/temática del evento
   * Source: BABY_SHOWER_INVITE_MOCK_DATA.sections.dressCode?.description = "VERDE"
   */
  readonly themeColor = computed(() => {
    const event = this.eventData();
    return event?.sections.dressCode?.description || 'VERDE';
  });

  /**
   * Descripción de la temática
   * Source: BABY_SHOWER_INVITE_MOCK_DATA.sections.dressCode?.title
   */
  readonly themeTitle = computed(() => {
    const event = this.eventData();
    return event?.sections.dressCode?.title || '¿la temática?';
  });

  /**
   * Descripción detallada de la temática
   * Source: comentario en mock data
   */
  readonly themeDescription = `para nosotros el verde significa:
vida silvestre
botánica
dinosaurios (esos ya no cuentan como vivos jeje)`;

  /**
   * Ideas de regalos para mostrar en la galería
   * Source: BABY_SHOWER_INVITE_MOCK_DATA.sections.gift?.ideas
   */
  readonly giftIdeas = computed(() => {
    const event = this.eventData();
    return event?.sections.gift?.ideas || [];
  });

  constructor() {
    this.loadEventData();
    // Configurar actualización automática del contador cada segundo
    this.setupCountdownTimer();
  }

  /**
   * Carga los datos del evento desde el mock data
   * Usa BABY_SHOWER_INVITE_MOCK_DATA como source de verdad
   */
  private loadEventData(): void {
    try {
      // TODO: En producción, cambiar a:
      // const demoData = this.inviteService.getDemoData();
      // Por ahora usamos el mock data local
      this.eventData.set(BABY_SHOWER_INVITE_MOCK_DATA);
    } catch (error) {
      console.error('Error cargando datos del evento:', error);
    }
  }

  /**
   * Configura un intervalo para actualizar el contador cada segundo
   * El interval se limpia automáticamente cuando el componente se destruye
   */
  private setupCountdownTimer(): void {
    effect(() => {
      const interval = setInterval(() => {
        this.currentTime.set(Date.now());
      }, 1000);

      return () => clearInterval(interval);
    });
  }

  /**
   * Abre el modal de ubicación
   * Muestra datos desde BABY_SHOWER_INVITE_MOCK_DATA.venue
   */
  openLocationModal(): void {
    this.isLocationModalOpen.set(true);
  }

  /**
   * Cierra el modal de ubicación
   */
  closeLocationModal(): void {
    this.isLocationModalOpen.set(false);
  }

  /**
   * Abre el modal del QR del regalo colectivo
   * Muestra QR desde BABY_SHOWER_INVITE_MOCK_DATA.sections.gift?.paymentQrCodeUrl
   */
  openCollectiveQrModal(): void {
    this.isCollectiveQrModalOpen.set(true);
  }

  /**
   * Cierra el modal del QR del regalo colectivo
   */
  closeCollectiveQrModal(): void {
    this.isCollectiveQrModalOpen.set(false);
  }

  /**
   * Abre el modal de galería de regalos
   * Muestra ideas de regalos desde BABY_SHOWER_INVITE_MOCK_DATA.sections.gift?.ideas
   */
  openGiftsModal(): void {
    this.isGiftsModalOpen.set(true);
  }

  /**
   * Cierra el modal de galería de regalos
   */
  closeGiftsModal(): void {
    this.isGiftsModalOpen.set(false);
  }

  /**
   * Genera la URL de WhatsApp para RSVP
   *
   * Número: 59177914381 (Belén / La Chinita)
   * Mensaje: "Asistiré al baby shower de [hostName]"
   * Con acompañantes: "... [Quisiera llevar a X persona conmigo!]"
   *
   * @param guestName - Nombre del invitado (TODO: obtener del formulario)
   * @param accompaniedCount - Número de personas que acompañarán (0 = solo invitado)
   * @returns URL completa para WhatsApp o "#" si falta número
   */
  getWhatsappRsvpUrl(guestName?: string, accompaniedCount: number = 0): string {
    // TODO: Nombre del invitado - obtener del contexto o formulario
    const nameDisplay = guestName || 'Invitadx';

    // Construcción del mensaje personalizado
    let messageText = `Asistiré al baby shower de ${this.hostName()} [Quisiera llevar a X persona conmigo!]`;

    if (accompaniedCount > 0) {
      const personLabel = accompaniedCount === 1 ? 'persona' : 'personas';
      messageText += ` [Quisiera llevar a ${accompaniedCount} ${personLabel} conmigo!]`;
    }

    const message = encodeURIComponent(messageText);
    const whatsappNum = this.whatsappNumber();

    if (!whatsappNum) {
      console.warn('Número de WhatsApp no configurado');
      return '#';
    }

    return `https://wa.me/${whatsappNum}?text=${message}`;
  }

  /**
   * Abre WhatsApp directamente con el mensaje de RSVP
   * Link abierto en nueva ventana/pestaña
   *
   * Flujo:
   * 1. Usuario hace click en "Registrate aquí"
   * 2. Se abre WhatsApp web o app
   * 3. Mensaje preconfigurado listo para enviar
   *
   * TODO: Integrar con componente de invitado para obtener datos reales
   */
  openWhatsappRsvp(): void {
    const url = this.getWhatsappRsvpUrl();
    if (url !== '#') {
      window.open(url, '_blank');
    }
  }
}

/*
# Tailwind instructions:

tamaños usados de tipografía:
<h2> 30 títulos grandes family=Barriecito
<tipografia 2> 15 informacion destacada family=Quicksand:wght@300..700&display=swap
<tipografia 3> 13 genérico family=Quicksand:wght@300..700&display=swap
<no considerada>11 para otras family=Quicksand:wght@300..700&display=swap

codigo de color acento: #7fc29b
codigo de color texto: #222222
codigo de color enlaces: #7fc29b
codigo de color de fondo: #7fc29b
codigo de color de contenedor: #F4F1F8
borde de contenedor redondeado a 1em
margen del contenedor: 1em

# Instructions!
<h2>Hola?</h2>
*Imagen en ruta /croac.webp
<before>“</before><tipografia 2>Pequeños charcos de agua, hojas frescas
y el dulce croar anuncian la llegada de mi retoño</tipografia 2><after>”</affter>


*Imagen en ruta /croac.webp (a la derecha)
<div izquierda>
<tipografia 2>Te invito a celebrar la dulce espera de mi pequeño renacuajo </tipografia 2>
<tipografia 3>
Con mi corazón lleno de alegría y paz,
quiero invitarte al <strong>baby shower</strong> de mi pequeñito
que pronto dará un gran brinco a mis brazos y a nuestras vidas.
</tipografia 3>
</div izquierda>
*Imagen en ruta /croac.webp
<tipografia 3>
Mi bebé y yo hemos preparado un día inspirado en los sonidos del agua,
la magia del bosque y, por supuesto, muchos animalitos…
</tipografia 3>

<tipografia 2>¡Especialmente en adorables <strong>ranitas</strong>!</tipografia 2>
(además que adelantaremos navidad, será una fiesta anfibia pre navideña)
</div izquierda>
*Imagen en ruta /croac.webp (izquierda)
<div derecha>
<h2>¿Cuándo?</h2>
<tipografia 2>
	20 de diciembre
	a partir de las 5 pm
en el país de las maravillas  <button abre modal location>ver ubicación </button>
</tipografia 2>

</div derecha>
*Imagen en ruta /croac.webp (derecha)
<mini imagen href /croac.webp><h2>¿la temática?</h2><mini imagen href /croac.webp>
<div centro>
<tipografia 2>VERDE</tipografia 2>
<tipografia 3>
para nosotros el verde significa:
vida silvestre
botánica
dinosaurios (esos ya no cuentan como vivos jeje)
</tipografia 3>

<tipografia 2>te animamos a vestir algo verde o colores neutros si lo deseas<tipografia 2>

</div centro>
<mini imagen href /croac.webp (izquierda)><mini imagen href /croac.webp (derecha)>
<tipografia 2><strong>Tu presencia será el regalo mas preciado en esta ocasión…</strong></tipografia 2>
<tipografia 3>pero en caso de querer compartir tu amor con mi pequeñito o conmigo…
</tipografia 3><tipografia 3>
aca te dejo algunas<a abre modal ideas>ideas</a> y por supuesto nuestra <a>lista de deseos</a>
</tipografia 3>

<tipografia 3>en caso de no decidirte por alguno… no te preocupes!<br>
también estamos haciendo vaquita para comprar lo necesario,<strong> lo dejamos a tu cariño</strong>
</tipografia 3>
<button abre modal de collective qr>Ver qr</button>
<tipografia 3>
y por supuesto puedes traer un <strong>regalo hecho a mano</strong> ¡lo amaremos aún más!
</tipografia 3>

*Imagen en ruta /croac.webp (centro)
<h2>INFORMACIÓN IMPORTANTE</h2>

<tipografia 3>Esta invitación te incluye a ti y si gustas un acompañante</tipografia 3>
<tipografia 3>NO OLVIDES <strong>CONFIRMAR TU ASISTENCIA</strong> Y/O LA DE TU ACOMPAÑANTE A MÁS TARDAR <strong>HASTA EL JUEVES 18 DE DIC</strong> </tipografia 3>

<boton>Registrate aquí</boton>

<tipografia 3>En esta ocasión la comida y bebidas serán bastante naturales y frescas. En caso de querer llevar algo para compartir solo considera que:
<strong>no habrá bebidas con alcohol y tampoco áreas para fumar</strong></tipografia 3>


<svg de una línea a la izquierda><mini imagen href /croac.webp (centro)><svg de una línea a la derecha>

<tipografia 2>¿Tienes alguna duda o dato que deba saber?</tipografia 2>
<a instagram:la_china_supay>hablame</a>


<tipografia 3 *Izquierda>Sin más que agregar y esperando que puedas acompañarnos… me despido.</tipografia 3>

<strong>atentamente:</strong> 

<tipografia 3>Belen/china supay/mamá rana
y obviamente el protagonista de este gran evento… <strong>mi bebé <3</strong></tipografia 3>

<mini imagen href /croac.webp (izquierda)><mini imagen href /croac.webp (derecha)>



<h2>FALTAN</h2>
<h2>7</h2><tipografia 2>DIAS,</tipografia 2><h2>10</h2><tipografia 2> HRS,</tipografia 2><h2>48</h2><tipografia 2> MIN,</tipografia 2><h2>36</h2> <tipografia 2>SEG</tipografia 2>
*Imagen en ruta /croac.webp (centro)

*/
