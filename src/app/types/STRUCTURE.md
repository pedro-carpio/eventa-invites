# ESTRUCTURA DE TIPOS - DOCUMENTACIÓN

Este documento explica la arquitectura de tipos del proyecto

## JERARQUÍA DE TIPOS

### 1. TIPOS COMUNES (common.types.ts)

```
├── Section: Representa una sección del evento
├── Activity: Actividad dentro de una sección
├── Image: Imagen en galería
├── Contact: Información de contacto
├── Venue: Ubicación del evento
├── SharingMetadata: Datos para compartición (con meta.title, meta.description)
└── DesignConfig: Configuración de diseño
```

### 2. EVENT BASE (event.types.ts)

Interfaz base que define propiedades comunes a todos los eventos:

```typescript
type Event = {
  title: string; // Título del evento
  subtitle: string; // Subtítulo
  hostName: string; // ✅ NEUTRO en género (no asumir relación)
  date: Date; // Fecha del evento
  durationHours?: number; // Duración estimada
  timezone?: string; // Zona horaria
  venue: Venue; // Ubicación
  contact?: Contact; // Contacto del anfitrión
  guests?: string[]; // Lista de invitados
  sections: Record<string, any>; // Secciones específicas (genérico)
  design: DesignConfig; // Configuración visual
  instagramTag?: string; // Tag de Instagram
};
```

### 3. TIPOS ESPECÍFICOS DE EVENTOS

#### a) BabyShower (baby-shower.types.ts) extends Event

```typescript
type BabyShower = Event & {
  babyName: string;           // ✅ Nombre del bebé (sujeto del evento)
  guests: string[];           // Lista de invitados
  sections: BabyShowerSections;
}

type BabyShowerSections = {
  dressCode?: {
    enabled: boolean;
    title?: string;           // Título configurable
    description?: string;     // Descripción (ej: "Puedes venir como quieras")
  };
  foodDetails?: {
    enabled: boolean;
    title?: string;           // "Detalles de la comida"
    content?: string;         // Descripción
  };
  locationDetails?: {
    enabled: boolean;
    title?: string;           // "Detalles de la ubicación"
    content?: string;         // Descripción
  };
  notes?: {
    enabled: boolean;
    title: string;            // "Notas importantes"
    content: Array<{ icon: string; text: string }>;
  };
  rsvp?: {
    enabled: boolean;
    title?: string;           // "Confirma tu asistencia"
    deadline?: Date;
    contactWhatsapp?: number;
    maxPlusOnes?: number;
    fields: Array<...>;       // Lista de invitados con confirmación
  };
  gift?: {
    enabled: boolean;
    title?: string;           // "Regalos"
    subtitle?: string;        // "Si deseas hacerme un regalo..."
    enabledCollectiveGift?: boolean;
    ideas?: Array<{ imgUrl: string; title: string; link: string }>;
    paymentQrCodeUrl?: string;
    paymentQrCodeInstructions?: string;
    giftListUrl?: string;
    giftListTag?: string;     // "También tengo una lista de..."
    instructions?: string;
  };
  gallery?: {
    enabled: boolean;
    title?: string;           // "Galería de fotos"
    description?: string;     // "Momentos especiales"
    images?: Image[];         // Imágenes de la galería
  };
  instagram?: {
    enabled: boolean;
    title?: string;           // "Comparte tus fotos y videos"
    description?: string;     // "Comparte tus fotos usando"
    tag: string;              // Hashtag
  };
  sharing?: {
    enabled: boolean;
    title?: string;           // "Comparte este evento"
    description?: string;     // "Invita a más gente..."
  };
}
```

#### b) Wedding (wedding.types.ts) extends Event

```typescript
type Wedding = Event & {
  partner1Name: string;
  partner2Name: string;
  guests: string[];
  sections: WeddingSections;
  // ... secciones específicas para matrimonios
};
```

## CONVENCIONES DE NOMENCLATURA

### PROPIEDADES DEL OBJETO

Usar camelCase, inglés, sin underscore:

✅ CORRECTO:

```typescript
hostName; // Neutro: anfitriód/a
babyName; // Nombre del bebé
durationHours; // Duración en horas
paymentQrCodeUrl; // URL del código QR
instagramTag; // Tag de Instagram
whatsappNumber; // Número de WhatsApp
```

❌ INCORRECTO:

```typescript
host_name; // ← use hostName
duration_hours; // ← use durationHours
payment_qr_code_url; // ← use paymentQrCodeUrl
instagram_tag; // ← use instagramTag
```

### LABELS UI (textos mostrados)

Los textos se configuran en los tipos, NO hardcodeados en templates:

✅ CORRECTO:

```typescript
sections.gift.title = 'Regalos';
sections.gift.subtitle = 'Si deseas hacerme un regalo...';
sections.dressCode.title = 'Dress code';
sections.instagram.description = 'Comparte tus fotos usando';
```

Template:

```html
<app-gifts
  [title]="currentEventData()?.sections?.gift?.title || 'Regalos'"
  [subtitle]="currentEventData()?.sections?.gift?.subtitle || '...'"
></app-gifts>
```

❌ INCORRECTO:

```html
<!-- Hardcodeados en template -->
<app-gifts title="Regalos" subtitle="Si deseas..."></app-gifts>
```

## VENTAJAS DE ESTA ARQUITECTURA

1. **Centralización de Configuración**: Todos los textos UI en el tipo `BabyShowerSections`
2. **Reutilización**: Múltiples eventos (Wedding, Birthday, etc.) heredan de `Event`
3. **Type Safety**: TypeScript verifica propiedades en tiempo de compilación
4. **Mantenibilidad**: Cambios en un lugar afectan toda la aplicación
5. **Gender Neutrality**: `hostName` no asume género del anfitrión
6. **Flexibilidad**: Cada sección es independiente (enabled/disabled)

## EJEMPLOS DE USO

### Crear un Baby Shower con datos personalizados

```typescript
const customBabyShower: BabyShower = {
  ...BABY_SHOWER_DEMO,
  title: 'Baby Shower de Martín',
  babyName: 'Martín',
  sections: {
    ...BABY_SHOWER_DEMO.sections,
    gift: {
      ...BABY_SHOWER_DEMO.sections.gift,
      title: 'Ayuda con la Canasta',
      subtitle: 'Nos encantaría que contribuyeras...',
    },
  },
};
```

### Usar en componente

```typescript
export class VinculoNatural {
  currentEventData = signal<BabyShower>(BABY_SHOWER_DEMO);

  // En template:
  // <app-gifts
  //   [title]="currentEventData()?.sections?.gift?.title"
  //   ...
  // ></app-gifts>
}
```

## ARCHIVOS RELACIONADOS

- `src/app/types/common/common.types.ts` - Tipos base reutilizables
- `src/app/types/event/event.types.ts` - Event base
- `src/app/types/event/baby-shower.types.ts` - BabyShower extends Event
- `src/app/types/event/wedding.types.ts` - Wedding ejemplo
- `src/app/constants/demo.data.ts` - Datos demo con valores configurables
- `src/app/types/event/index.ts` - Re-exportaciones

## ÚLTIMOS CAMBIOS (Task 3)

- ✅ Agregadas propiedades `title` a todas las secciones
- ✅ Agregadas propiedades `subtitle` y `description` donde aplique
- ✅ Movidas secciones `gallery` e `instagram` a `BabyShowerSections`
- ✅ Actualizado `demo.data.ts` con todos los títulos configurables
- ✅ Actualizado template `vinculo-natural.html` para usar títulos del tipo
- ✅ Removidas referencias hardcodeadas a labels en templates

/\*\*

- 1.  REUTILIZACIÓN
- - Crear nuevo evento (Birthday, Anniversary) es solo extender Event
- - No duplicar código
-
- 2.  MANTENIMIENTO
- - Cambios en base se replican a todos los eventos
- - Tipos genéricos facilitan refactoring
-
- 3.  SCALABILIDAD
- - Agregar campos comunes es cambiar una sola interfaz
- - Nuevas secciones sin modificar código base
-
- 4.  TYPE SAFETY
- - Funciones de validación (isValidBabyShower)
- - TypeScript garantiza estructuras correctas
-
- 5.  FLEXIBILIDAD
- - sections es Record genérico -> permite cualquier sección
- - Compatibilidad hacia atrás con alias (babyShower)
    \*/

// =============================================================================
// EJEMPLOS DE USO
// =============================================================================

/\*\*

- IMPORTAR:
-
- import { BabyShower, Event, isValidBabyShower } from '@/types/event';
- import { Section, Activity, Contact } from '@/types/common';
  \*/

/\*\*

- CREAR EVENTO:
-
- const event: BabyShower = {
-     title: "Baby Shower",
-     subtitle: "Celebración especial",
-     hostName: "Belén",  // NEUTRO
-     babyName: "Guagüita",
-     date: new Date(),
-     guests: ["Juan", "María"],
-     venue: { name: "Casa", address: "Calle 123", city: "La Paz", country: "Bolivia" },
-     contact: { whatsappNumber: 5917123456 },
-     sections: {
-       location: { id: "location", enabled: true, title: "Ubicación" },
-       gifts: { id: "gifts", enabled: true, title: "Regalos" },
-       gift: { enabled: true, enabledCollectiveGift: true, ideas: [] }
-     },
-     design: {
-       templateId: "vinculo-natural",
-       galleryImages: [],
-       sharing: { meta: { title: "Comparte", description: "Único" } }
-     }
- };
  \*/

/\*\*

- VALIDAR:
-
- if (isValidBabyShower(someObject)) {
-     // TypeScript sabe que es BabyShower
-     console.log(someObject.babyName);
- }
  \*/

export type DocumentationMarker = 'This is documentation only';
