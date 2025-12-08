/\*\*

- ESTRUCTURA DE TIPOS - DOCUMENTACIÓN
-
- Este documento explica la arquitectura de tipos del proyecto
  \*/

// =============================================================================
// JERARQUÍA DE TIPOS
// =============================================================================

/\*\*

- 1.  TIPOS COMUNES (common.types.ts)
- ├── Section: Representa una sección del evento
- ├── Activity: Actividad dentro de una sección
- ├── Image: Imagen en galería
- ├── Contact: Información de contacto
- ├── Venue: Ubicación del evento
- ├── SharingMetadata: Datos para compartición
- └── DesignConfig: Configuración de diseño
  \*/

/\*\*

- 2.  EVENT BASE (event.types.ts)
- Interfaz base que define propiedades comunes a todos los eventos:
- - title, subtitle, date, durationHours
- - hostName (NEUTRO en género)
- - venue, contact, photoUrl
- - sections (Record genérico)
- - design (DesignConfig)
    \*/

/\*\*

- 3.  TIPOS ESPECÍFICOS DE EVENTOS
- a) BabyShower (baby-shower.types.ts) extends Event
-       - babyName: string (el sujeto del evento)
-       - guests: string[]
-       - sections: BabyShowerSections
-
- b) Wedding (wedding.types.ts) extends Event
-       - partner1Name, partner2Name
-       - guests: string[]
-       - sections: WeddingSections
  \*/

// =============================================================================
// CONVENCIONES DE NOMENCLATURA
// =============================================================================

/\*\*

- PROPIEDADES DEL OBJETO:
- - Usar camelCase
- - Inglés
- - NO usar underscore
-
- ✅ CORRECTO:
- - hostName
- - babyName
- - durationHours
- - paymentQrCodeUrl
- - instagramTag
-
- ❌ INCORRECTO:
- - host_name (use hostName)
- - duration_hours (use durationHours)
- - payment_qr_code_url (use paymentQrCodeUrl)
    \*/

/\*\*

- LABELS UI (textos mostrados):
- - Español
- - Desde el objeto (no hardcodeados)
-
- ✅ CORRECTO:
- - design.sharing.meta.title = "Comparte este evento"
- - sections.location.title = "Ubicación"
-
- ❌ INCORRECTO:
- - Textos hardcodeados en HTML templates
    \*/

// =============================================================================
// VENTAJAS DE ESTA ARQUITECTURA
// =============================================================================

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
