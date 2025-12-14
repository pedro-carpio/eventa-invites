import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { BabyShower } from '../../../types/event/baby-shower.types';
import { VinculoNatural } from '../../template/baby-shower/vinculo-natural/vinculo-natural';
import { DOCUMENT } from '@angular/common';

/**
 * Componente Invite Demo
 *
 * Renderiza la plantilla VinculoNatural con datos mock basados en el comentario original.
 * Todos los datos provienen exclusivamente del contenido documentado al final del archivo.
 *
 * Módulos utilizados en la plantilla:
 * - Countdown: Muestra el tiempo restante hasta el evento
 * - Guests: Lista de invitados (opcional, no especificado en datos)
 * - Itinerary: Ubicación del evento
 * - Gifts: Información de regalos y regalo colectivo
 * - Galery: Galería de fotos (deshabilitada, no hay fotos en datos)
 * - Info: Información de dress code
 * - Notes: Notas importantes del evento
 * - Rsvp: Confirmación de asistencia
 * - Contact: Información de contacto
 */
@Component({
  selector: 'app-invite-demo',
  imports: [VinculoNatural],
  template: `
    <app-vinculo-natural
      [eventDataInput]="mockData()"
      [principalPhotoUrl]="currentUrl()"
    ></app-vinculo-natural>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InviteDemo {
  private readonly document = inject(DOCUMENT);

  /**
   * URL actual del navegador, usada como foto principal del evento
   */
  currentUrl = signal<string>(this.getCurrentUrl());

  /**
   * Obtiene la URL de la foto principal
   * Extrae el nombre del archivo de la ruta actual y lo mapea a /public
   * En SSR retorna un placeholder
   */
  private getCurrentUrl(): string {
    if (typeof window !== 'undefined') {
      // Extrae el último segmento de la URL (ej: 'croac' de '/invitacion/croac')
      return `/croac.webp`;
    }
    return 'https://placehold.co/1200x600';
  }

  /**
   * Datos mock extraídos del comentario original
   *
   * Análisis de contenido:
   * - Anfitrión: Belén (mamá rana)
   * - Bebé: Renacuajo (tema temático)
   * - Fecha: 20 de diciembre, 5 pm
   * - Ubicación: El país de las maravillas
   * - Tema: Verde (vida silvestre, botánica, dinosaurios)
   * - Regalos: Vaquita colectiva + regalo hecho a mano
   * - Restricciones: Sin alcohol, sin fumar
   * - Acompañantes: 1 por invitado
   *
   * Campos opcionales (no especificados en datos):
   * - Invitados específicos: no listados
   * - Fotos de galería: no incluidas
   * - Coordenadas de ubicación: no especificadas
   * - Número de WhatsApp: no proporcionado
   * - Lista de deseos: no detalles
   */
  mockData = signal<BabyShower>({
    // Información básica del evento
    title: 'Baby Shower de mi pequeño renacuajo',
    subtitle:
      'Te invito a celebrar la dulce espera de mi pequeñito que pronto dará un gran brinco a mis brazos y a nuestras vidas',
    hostName: 'Belén',
    babyName: 'Renacuajo',
    date: new Date(2025, 11, 20, 17, 0), // 20 de diciembre a las 5 pm
    durationHours: 3,
    timezone: 'America/La_Paz',

    // Contacto (información no especificada en el comentario)
    contact: {
      whatsappNumber: 591, // Número de ejemplo para Bolivia (país mencionado en zona horaria)
    },

    // Ubicación
    venue: {
      name: 'El país de las maravillas',
      address: '',
      city: '',
      country: '',
      latitude: undefined,
      longitude: undefined,
      instructions: undefined,
    },

    // Invitados (no especificados, lista vacía)
    guests: [],

    // Instagram (no especificado)
    instagramTag: undefined,

    // Secciones del evento
    sections: {
      // Notas importantes: información obligatoria del evento
      notes: {
        enabled: true,
        title: 'INFORMACIÓN IMPORTANTE',
        content: [
          {
            icon: 'info',
            text: 'Esta invitación te incluye a ti y si gustas un acompañante',
          },
          {
            icon: 'event',
            text: 'NO OLVIDES CONFIRMAR TU ASISTENCIA Y/O LA DE TU ACOMPAÑANTE A MÁS TARDAR HASTA EL JUEVES 18 DE DIC',
          },
          {
            icon: 'local_dining',
            text: 'En esta ocasión la comida y bebidas serán bastante naturales y frescas. No habrá bebidas con alcohol y tampoco áreas para fumar',
          },
        ],
      },

      // Dress code: información temática del evento
      dressCode: {
        enabled: true,
        title: '¿La temática?',
        description:
          'VERDE - Vida silvestre, botánica, dinosaurios. Te animamos a vestir algo verde o colores neutros si lo deseas',
      },

      // Detalles de ubicación: cuándo es el evento
      locationDetails: {
        enabled: true,
        title: '¿Cuándo?',
        content: '20 de diciembre a partir de las 5 pm',
      },

      // RSVP: confirmación de asistencia
      rsvp: {
        enabled: true,
        title: 'Confirma tu asistencia',
        maxPlusOnes: 1, // Cada invitado puede llevar 1 acompañante
        fields: [],
      },

      // Regalos: información sobre regalos y vaquita colectiva
      gift: {
        enabled: true,
        title: 'Regalos',
        subtitle:
          'Tu presencia será el regalo más preciado en esta ocasión… pero en caso de querer compartir tu amor con mi pequeñito o conmigo, aquí te dejo algunas ideas',
        enabledCollectiveGift: true,
        ideas: [], // No hay ideas específicas en los datos
        collectiveGiftTitle: 'Regalo Colectivo',
        collectiveGiftDescription:
          'También estamos haciendo vaquita para comprar lo necesario, lo dejamos a tu cariño',
        collectiveGiftButtonTag: 'Contribuir al regalo colectivo',
        instructions: 'O por supuesto puedes traer un regalo hecho a mano, ¡lo amaremos aún más!',
      },

      // Galería: deshabilitada (no hay fotos en los datos)
      gallery: {
        enabled: false,
      },

      // Instagram: deshabilitado (no se menciona en los datos)
      instagram: {
        enabled: false,
      },

      // Compartir evento: sección de compartición
      sharing: {
        enabled: true,
        title: 'Comparte este evento',
      },

      // Detalles de comida: deshabilitado (información ya en notas)
      foodDetails: {
        enabled: false,
      },
    },

    // Configuración de diseño
    design: {
      templateId: 'vinculo-natural',
      galleryImages: [],
      sharing: {
        meta: {
          title: 'Baby Shower de mi pequeño renacuajo',
          description:
            'Mi bebé y yo hemos preparado un día inspirado en los sonidos del agua, la magia del bosque y muchos animalitos adorables ranitas',
        },
      },
    },
  });
}
/*
Hola?*Titulo
*Foto en ruta raiz/croac.webp
“Pequeños charcos de agua, hojas frescas
y el dulce croar anuncian la llegada de mi retoño”


-------------------------------------------------------------------------------------------------------------------------

Te invito a celebrar la dulce espera de mi pequeño renacuajo

Con mi corazón lleno de alegría y paz,
quiero invitarte al <b>baby shower</b> de mi pequeñito
que pronto dará un gran brinco a mis brazos y a nuestras vidas.


-------------------------------------------------------------------------------------------------------------------------

Mi bebé y yo hemos preparado un día inspirado en los sonidos del agua,
la magia del bosque y, por supuesto, muchos animalitos…


¡Especialmente en adorables <b>ranitas</b>!
(además que adelantaremos navidad, será una fiesta anfibia pre navideña)

-------------------------------------------------------------------------------------------------------------------------

¿Cuándo? *Titulo
	20 de diciembre
	a partir de las 5 pm
en el país de las maravillas *ver ubicación

-------------------------------------------------------------------------------------------------------------------------
¿la temática? *Titulo
VERDE *Subtitulo
para nosotros el verde significa:
vida silvestre
botánica
dinosaurios (esos ya no cuentan como vivos jeje)

te animamos a vestir algo verde o colores neutros si lo deseas
-------------------------------------------------------------------------------------------------------------------------

<b>Tu presencia será el regalo mas preciado en esta ocasión…</b>
pero en caso de querer compartir tu amor con mi pequeñito o conmigo…

aca te dejo algunas <a>ideas</a> y por supuesto nuestra <a>lista de deseos</a>

en caso de no decidirte por alguno… no te preocupes!
también estamos haciendo vaquita para comprar lo necesario,<b> lo dejamos a tu cariño</b>

y por supuesto puedes traer un <b>regalo hecho a mano</b> ¡lo amaremos aún más!

-------------------------------------------------------------------------------------------------------------------------
INFORMACIÓN IMPORTANTE *Titulo

Esta invitación te incluye a ti y si gustas un acompañante
NO OLVIDES <b>CONFIRMAR TU ASISTENCIA</b> Y/O LA DE TU ACOMPAÑANTE A MÁS TARDAR <b>HASTA EL JUEVES 18 DE DIC</b> 

Registrate aquí *botón


En esta ocasión la comida y bebidas serán bastante naturales y frescas. En caso de querer llevar algo para compartir solo considera que:
<b>no habrá bebidas con alcohol y tampoco áreas para fumar</b>


-------------------------------------------------------------------------------------------------------------------------

¿Tienes alguna duda o dato que deba saber? *Subtitulo
hablame *boton

-------------------------------------------------------------------------------------------------------------------------

Sin mas que agregar y esperando que puedas acompañarnos… me despido.

<b>atentamente:</b> 

Belen/china supay/mamá rana
y obviamente el protagonista de este gran evento… <b>mi bebé <3</b>

-------------------------------------------------------------------------------------------------------------------------


FALTAN *Titulo
7*Titulo DIAS,*Subtitulo 10*Titulo HRS,*Subtitulo 48*Titulo MIN,*Subtitulo 36*Titulo SEG*Subtitulo



tamaños usados de tipografía:
30 *Titulos family=Barriecito
15 *Subtitulos family=Quicksand:wght@300..700&display=swap
13 genérico family=Quicksand:wght@300..700&display=swap
11 en casos extras family=Quicksand:wght@300..700&display=swap
codigo de color acento: #7fc29b
codigo de color texto: #222222
codigo de color enlaces: #7fc29b
codigo de color de fondo: #7fc29b
codigo de color de contenedor: #F4F1F8
borde de contenedor redondeado a 1em
el contenido dentro del contenedor debe ir todo al centro

*/
