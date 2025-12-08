# Capa de Servicios (Service Layer)

Documentación detallada de los servicios disponibles en la aplicación de invitaciones a eventos.

## Visión General

Los servicios proporcionan funcionalidad reutilizable y centralizada:

- **InviteService:** Gestión de datos de invitaciones
- **ShareService:** Funcionalidad de compartir en redes sociales
- **MapsService:** Integración con servicios de mapas

Todos están configurados con `providedIn: 'root'` para inyección automática.

---

## InviteService

### Propósito

Gestionar datos de eventos: cargar, formatear, validar, clonar.

### Ubicación

`src/app/services/invite.service.ts`

### Inyección

```typescript
export class MyComponent {
  private inviteService = inject(InviteService);
}
```

### Métodos

#### `getDemoData(): BabyShower`

Retorna datos de demostración precargados.

**Retorna:** `BabyShower` completamente configurado

**Uso:**

```typescript
const demoEvent = this.inviteService.getDemoData();
// {
//   hostName: 'Anfitriód',
//   babyName: 'Sofía',
//   date: Date,
//   sections: { gift: {...}, rsvp: {...}, ... }
// }
```

**Cuándo usar:**

- Mostrar preview de evento
- Llenar datos iniciales cuando no hay datos del usuario
- Desarrollo y pruebas

---

#### `loadEventById(eventId: string): Promise<Event>`

Carga un evento desde API/base de datos.

**Parámetros:**

- `eventId` (string): ID único del evento

**Retorna:** `Promise<Event>` (con error handling)

**Uso:**

```typescript
try {
  const event = await this.inviteService.loadEventById('evt-12345');
  this.eventData.set(event);
} catch (error) {
  this.errorMessage.set('No se pudo cargar el evento');
}
```

**Implementación actual:** Placeholder que siempre retorna demo data

**Implementación futura:**

```typescript
loadEventById(eventId: string): Promise<Event> {
  return this.http.get<Event>(`/api/events/${eventId}`).toPromise();
}
```

---

#### `formatDate(date: Date): { day: number; month: string; year: number }`

Formatea una fecha para visualización.

**Parámetros:**

- `date` (Date): Objeto Date a formatear

**Retorna:** Objeto con propiedades `day`, `month`, `year`

**Uso:**

```typescript
const formatted = this.inviteService.formatDate(new Date(2024, 0, 15));
// { day: 15, month: 'Enero', year: 2024 }

// En template:
<span>{{ formatDate(date()).day }} de {{ formatDate(date()).month }}</span>
```

**Detalles:**

- Mes en español
- Día como número (1-31)
- Año completo (4 dígitos)

---

#### `getDateFromNow(daysFromNow: number): Date`

Calcula una fecha futura relativa a hoy.

**Parámetros:**

- `daysFromNow` (number): Número de días en el futuro

**Retorna:** Objeto `Date` con la fecha futura

**Uso:**

```typescript
// Evento en 30 días
const eventDate = this.inviteService.getDateFromNow(30);

// Para calcular cuenta regresiva
const now = new Date();
const diff = eventDate.getTime() - now.getTime();
const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
```

**Ejemplos:**

```typescript
getDateFromNow(0); // Hoy
getDateFromNow(7); // Próximo 7 días
getDateFromNow(365); // Próximo año
```

---

#### `isValidEvent(event: unknown): boolean`

Valida que un objeto sea un evento válido.

**Parámetros:**

- `event` (unknown): Objeto a validar

**Retorna:** `boolean` - true si es válido, false en caso contrario

**Uso:**

```typescript
const data = JSON.parse(userInput);
if (this.inviteService.isValidEvent(data)) {
  // Es seguro usar como Event
  this.eventData.set(data);
} else {
  this.errorMessage.set('Datos inválidos');
}
```

**Validaciones internas:**

- Tiene propiedades requeridas (date, venue, sections)
- `date` es un Date válido
- `venue` tiene estructura correcta
- `sections` es un objeto

---

#### `cloneEvent(event: Event): Event`

Crea una copia profunda de un evento.

**Parámetros:**

- `event` (Event): Evento a clonar

**Retorna:** Nueva instancia con los mismos datos

**Uso:**

```typescript
const originalEvent = this.inviteService.getDemoData();
const modifiedEvent = this.inviteService.cloneEvent(originalEvent);

// Modificar sin afectar original
modifiedEvent.title = 'Mi Evento Personalizado';
// originalEvent.title sigue siendo 'Baby Shower'
```

**Por qué es importante:**

- Evita mutaciones no intencionales
- Permite guardar versiones anteriores
- Seguro para undo/redo

---

### Ejemplo Completo: Integración en Componente

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { InviteService } from '../../services/invite.service';
import { BabyShower } from '../../types/event/baby-shower.types';
import { signal } from '@angular/core';

@Component({
  selector: 'app-event-viewer',
  template: `
    @if (event(); as e) {
      <h1>{{ e.title }}</h1>
      <p>
        Fecha: {{ formatDate(e.date).day }} de {{ formatDate(e.date).month }},
        {{ formatDate(e.date).year }}
      </p>
      <p>Organizador: {{ e.hostName }}</p>
    } @else {
      <p>Cargando...</p>
    }
  `,
})
export class EventViewerComponent implements OnInit {
  private inviteService = inject(InviteService);
  event = signal<BabyShower | null>(null);

  ngOnInit() {
    // Cargar datos de demostración
    const demoEvent = this.inviteService.getDemoData();
    this.event.set(demoEvent);
  }

  formatDate = (date: Date) => this.inviteService.formatDate(date);
}
```

---

## ShareService

### Propósito

Facilitar compartir eventos en redes sociales y exportar datos.

### Ubicación

`src/app/services/share.service.ts`

### Inyección

```typescript
export class MyComponent {
  private shareService = inject(ShareService);
}
```

### Métodos

#### `copyToClipboard(text: string): Promise<boolean>`

Copia texto al portapapeles del usuario.

**Parámetros:**

- `text` (string): Texto a copiar

**Retorna:** `Promise<boolean>` - true si tuvo éxito

**Uso:**

```typescript
const url = this.shareService.getCurrentUrl();
const success = await this.shareService.copyToClipboard(url);

if (success) {
  console.log('URL copiada al portapapeles');
} else {
  console.log('Error al copiar');
}
```

**Navegadores soportados:**

- Chrome/Edge: ✅ (Clipboard API)
- Firefox: ✅ (Clipboard API)
- Safari: ✅ (Clipboard API)
- IE11: ❌ (fallback a document.execCommand)

---

#### `shareViaWeb(shareData: ShareData): Promise<boolean>`

Usa el Web Share API del navegador para compartir.

**Parámetros:**

- `shareData` (ShareData): Datos a compartir
  ```typescript
  {
    title: string;    // Título del evento
    text: string;     // Descripción
    url?: string;     // URL del evento
    files?: File[];   // (Opcional) Archivos
  }
  ```

**Retorna:** `Promise<boolean>` - true si compartió

**Uso:**

```typescript
const shared = await this.shareService.shareViaWeb({
  title: 'Invitación a Baby Shower',
  text: 'Te invito a la baby shower de Sofía',
  url: window.location.href,
});

if (!shared) {
  console.log('Compartir no disponible en este navegador');
  // Mostrar UI alternativa (botones de redes sociales)
}
```

**Navegadores soportados:**

- Chrome Android: ✅
- Safari iOS 13+: ✅
- Desktop: ⚠️ (solo algunos navegadores)

**Alternativa en escritorio:** Usa botones de WhatsApp, Facebook, etc.

---

#### `getWhatsAppShareUrl(message: string, phoneNumber?: string): string`

Genera URL para compartir vía WhatsApp.

**Parámetros:**

- `message` (string): Mensaje personalizado
- `phoneNumber` (string, opcional): Número sin formato

**Retorna:** URL de WhatsApp (lista para usar en `window.open()` o como `href`)

**Uso:**

```typescript
// Sin número específico (abre conversaciones recientes)
const url1 = this.shareService.getWhatsAppShareUrl(
  'Te invito a la baby shower de Sofía: https://evento.com'
);
window.open(url1, '_blank');

// Con número específico
const url2 = this.shareService.getWhatsAppShareUrl(
  'Hola María, ¿vienes a la baby shower?',
  '+34612345678' // Número con código de país
);

// En template como enlace
<a [href]="getWhatsAppUrl()">Compartir por WhatsApp</a>
```

**Formato de URL:**

```
https://wa.me/?text=Tu%20mensaje%20con%20URL
https://wa.me/[NUMERO]?text=Tu%20mensaje
```

---

#### `getFacebookShareUrl(url: string): string`

Genera URL para compartir en Facebook.

**Parámetros:**

- `url` (string): URL del evento a compartir

**Retorna:** URL de Facebook Share Dialog

**Uso:**

```typescript
const eventUrl = this.shareService.getCurrentUrl();
const facebookUrl = this.shareService.getFacebookShareUrl(eventUrl);

window.open(facebookUrl, '_blank', 'width=600,height=400');
```

**Requiere:**

- Evento registrado en Facebook Developers
- Configurar URL permitidas en Facebook App Settings

---

#### `getInstagramShareUrl(hashtag: string): string`

Genera URL para explorar hashtag en Instagram.

**Parámetros:**

- `hashtag` (string): Hashtag sin `#`

**Retorna:** URL para explorar hashtag en Instagram

**Uso:**

```typescript
const instagramUrl = this.shareService.getInstagramShareUrl('bautizo2024');
// https://www.instagram.com/explore/tags/bautizo2024/

// No es "compartir" directo, pero permite a usuarios encontrar fotos
<a [href]="instagramUrl" target="_blank">Ver en Instagram</a>
```

**Nota:**
Instagram no tiene API para compartir directamente desde web. Esto abre el explorador de hashtags.

---

#### `getCurrentUrl(): string`

Retorna la URL actual del navegador.

**Retorna:** URL completa (incluyendo query params)

**Uso:**

```typescript
// Para compartir la invitación en su URL actual
const url = this.shareService.getCurrentUrl();

const message = `Te invito a mi evento: ${url}`;
this.shareService.copyToClipboard(message);
```

**Ejemplo de retorno:**

```
https://evento.com/invitations/baby-shower?id=abc123
```

---

#### `downloadElement(elementRef: ElementRef): void`

Descarga un elemento DOM como imagen.

**Parámetros:**

- `elementRef` (ElementRef): Referencia al elemento HTML

**Uso:**

```typescript
// En template
<div #eventCard><!-- contenido del evento --></div>

// En componente
@ViewChild('eventCard') eventCard!: ElementRef;

downloadInvitation() {
  this.shareService.downloadElement(this.eventCard);
  // Descarga como 'screenshot.png'
}
```

**Técnica:** Usa html2canvas + descarga de blob

---

#### `downloadImage(imageUrl: string): void`

Descarga una imagen desde URL.

**Parámetros:**

- `imageUrl` (string): URL de la imagen

**Uso:**

```typescript
const qrCodeUrl = event.sections.gift.paymentQrCodeUrl;
this.shareService.downloadImage(qrCodeUrl);
// Abre diálogo de descarga
```

---

### Ejemplo Completo: Modal de Compartir

```typescript
import { Component, computed, inject, input, output } from '@angular/core';
import { ShareService } from '../../services/share.service';
import { BabyShower } from '../../types/event/baby-shower.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-share-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal">
      <h2>Compartir Invitación</h2>

      <button (click)="shareViaWeb()"><span class="icon">🔗</span> Compartir</button>

      <a [href]="whatsappUrl()" target="_blank"> <span class="icon">💬</span> WhatsApp </a>

      <a [href]="facebookUrl()" target="_blank"> <span class="icon">f</span> Facebook </a>

      <a [href]="instagramUrl()" target="_blank"> <span class="icon">📷</span> Instagram </a>

      <button (click)="copyUrl()"><span class="icon">📋</span> Copiar enlace</button>

      <button (click)="close.emit()">Cerrar</button>
    </div>
  `,
})
export class ShareModal {
  private shareService = inject(ShareService);

  shareData = input<any>();
  close = output<void>();

  url = computed(() => this.shareService.getCurrentUrl());

  whatsappUrl = computed(() =>
    this.shareService.getWhatsAppShareUrl(`Te invito a mi evento: ${this.url()}`),
  );

  facebookUrl = computed(() => this.shareService.getFacebookShareUrl(this.url()));

  instagramUrl = computed(() => this.shareService.getInstagramShareUrl('evento2024'));

  async shareViaWeb() {
    await this.shareService.shareViaWeb({
      title: 'Invitación a Baby Shower',
      text: 'Te invito a mi evento especial',
      url: this.url(),
    });
  }

  async copyUrl() {
    await this.shareService.copyToClipboard(this.url());
    alert('Enlace copiado');
  }
}
```

---

## MapsService

### Propósito

Integración con servicios de mapas (Google Maps, OpenStreetMap).

### Ubicación

`src/app/services/maps.service.ts`

### Interfaz Base

```typescript
export interface IMapsService {
  getMapUrl(latitude: number, longitude: number, zoom?: number): string;
  getMapUrlFromAddress(address: string): string;
  openMap(latitude: number, longitude: number, zoom?: number): void;
}
```

### Implementaciones

#### GoogleMapsService (Por defecto)

```typescript
@Injectable({ providedIn: 'root' })
export class GoogleMapsService implements IMapsService {
  getMapUrl(latitude, longitude, zoom = 15): string;
  getMapUrlFromAddress(address): string;
  openMap(latitude, longitude, zoom = 15): void;
}
```

**Ventajas:**

- ✅ Más ampliamente soportado
- ✅ Mejor experiencia de usuario
- ❌ Requiere API key para algunas funciones

**URL de ejemplo:**

```
https://maps.google.com?q=40.7128,-74.0060&z=15
```

---

#### OpenStreetMapsService (Privacidad)

```typescript
@Injectable()
export class OpenStreetMapsService implements IMapsService {
  getMapUrl(latitude, longitude, zoom = 15): string;
  getMapUrlFromAddress(address): string;
  openMap(latitude, longitude, zoom = 15): void;
}
```

**Ventajas:**

- ✅ Open source, privado
- ✅ No requiere API key
- ❌ UX menos pulido que Google Maps

**URL de ejemplo:**

```
https://www.openstreetmap.org?mlat=40.7128&mlon=-74.0060&zoom=15
```

---

### Métodos

#### `getMapUrl(latitude: number, longitude: number, zoom?: number): string`

Genera URL para abrir un mapa en nueva ventana.

**Parámetros:**

- `latitude` (number): Latitud (-90 a 90)
- `longitude` (number): Longitud (-180 a 180)
- `zoom` (number, opcional): Nivel de zoom (1-21, default 15)

**Retorna:** URL del mapa (string)

**Uso:**

```typescript
const mapUrl = this.mapsService.getMapUrl(40.7128, -74.0060, 17);
// Abre en nueva ventana al hacer clic en enlace
<a [href]="mapUrl" target="_blank">Ver ubicación</a>
```

---

#### `getMapUrlFromAddress(address: string): string`

Genera URL para buscar un lugar por dirección.

**Parámetros:**

- `address` (string): Dirección completa o parcial

**Retorna:** URL del mapa (string)

**Uso:**

```typescript
const address = 'Iglesia San Francisco, Madrid, España';
const mapUrl = this.mapsService.getMapUrlFromAddress(address);

<a [href]="mapUrl" target="_blank">{{ address }}</a>
```

---

#### `openMap(latitude: number, longitude: number, zoom?: number): void`

Abre el mapa directamente en nueva ventana.

**Parámetros:**

- `latitude` (number): Latitud
- `longitude` (number): Longitud
- `zoom` (number, opcional): Nivel de zoom

**Retorna:** void (efecto secundario: abre ventana)

**Uso:**

```typescript
openLocationModal() {
  const venue = this.eventData().venue;
  this.mapsService.openMap(venue.latitude!, venue.longitude!, 17);
}

// O en template
<button (click)="mapsService.openMap(40.7128, -74.0060, 17)">
  Ver en mapa
</button>
```

---

### Cambiar Proveedor de Mapas

```typescript
// En app.config.ts o main.ts
import { GoogleMapsService, OpenStreetMapsService } from './services/maps.service';

export const appConfig: ApplicationConfig = {
  providers: [
    // Usar GoogleMapsService (por defecto)
    { provide: GoogleMapsService, useClass: GoogleMapsService },

    // O cambiar a OpenStreetMaps
    // { provide: GoogleMapsService, useClass: OpenStreetMapsService },
  ],
};
```

---

### Ejemplo Completo: Modal de Ubicación

```typescript
import { Component, computed, inject, input, output } from '@angular/core';
import { GoogleMapsService } from '../../services/maps.service';
import { Venue } from '../../types/common/common.types';

@Component({
  selector: 'app-location-modal',
  standalone: true,
  template: `
    <div class="location-modal">
      <h2>{{ venue().name }}</h2>

      <div class="address-info">
        <p>{{ venue().address }}</p>
        <p>{{ venue().city }}, {{ venue().country }}</p>
      </div>

      @if (venue().instructions) {
        <div class="instructions">
          <h3>Cómo llegar</h3>
          <p>{{ venue().instructions }}</p>
        </div>
      }

      <button (click)="openMap()">Abrir en Google Maps</button>

      @if (mapUrl(); as url) {
        <a [href]="url" target="_blank">Link directo al mapa</a>
      }

      <button (click)="close.emit()">Cerrar</button>
    </div>
  `,
})
export class LocationModal {
  private mapsService = inject(GoogleMapsService);

  venue = input.required<Venue>();
  close = output<void>();

  mapUrl = computed(() => {
    const v = this.venue();
    if (v.latitude !== undefined && v.longitude !== undefined) {
      return this.mapsService.getMapUrl(v.latitude, v.longitude, 17);
    }
    return this.mapsService.getMapUrlFromAddress(`${v.address}, ${v.city}, ${v.country}`);
  });

  openMap() {
    const v = this.venue();
    if (v.latitude !== undefined && v.longitude !== undefined) {
      this.mapsService.openMap(v.latitude, v.longitude, 17);
    }
  }
}
```

---

## Inyección de Dependencias

### Patrón Recomendado

```typescript
import { inject } from '@angular/core';
import { InviteService } from './invite.service';

@Component({...})
export class MyComponent {
  // ✅ Usar inject() en lugar de constructor
  private inviteService = inject(InviteService);
  private shareService = inject(ShareService);

  ngOnInit() {
    const data = this.inviteService.getDemoData();
  }
}
```

### Por qué `inject()` es mejor

- ✅ Sintaxis más limpia
- ✅ Funciona en mixins y funciones
- ✅ No requiere constructor boilerplate
- ✅ Compatible con lazy dependencies
- ✅ Mejor para testing

---

## Testing de Servicios

### Mock de InviteService

```typescript
import { TestBed } from '@angular/core/testing';
import { InviteService } from './invite.service';
import { BABY_SHOWER_DEMO } from '../constants/demo.data';

describe('InviteService', () => {
  let service: InviteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InviteService],
    });
    service = TestBed.inject(InviteService);
  });

  it('should return demo data', () => {
    const demo = service.getDemoData();
    expect(demo).toBeDefined();
    expect(demo.hostName).toBe('Anfitriód');
    expect(demo.babyName).toBe('Sofía');
  });

  it('should format date correctly', () => {
    const date = new Date(2024, 0, 15); // 15 de enero 2024
    const formatted = service.formatDate(date);
    expect(formatted.day).toBe(15);
    expect(formatted.month).toBe('Enero');
    expect(formatted.year).toBe(2024);
  });

  it('should clone event without mutation', () => {
    const original = service.getDemoData();
    const cloned = service.cloneEvent(original);

    cloned.title = 'Modified';
    expect(original.title).not.toBe('Modified');
  });
});
```

---

## Limitaciones y Consideraciones

### InviteService

- `loadEventById()` es placeholder (implementar con HTTP)
- No hay soporte para persistencia local
- No hay caché de eventos

### ShareService

- Web Share API solo disponible en navegadores modernos
- Requiere HTTPS en producción
- Download de imágenes depende de CORS

### MapsService

- Google Maps puede requerir API key
- OpenStreetMap tiene limitaciones de uso
- No hay búsqueda de direcciones integrada

---

## Roadmap de Servicios

### Próximamente

- [ ] LocationService (búsqueda de direcciones, geocoding)
- [ ] AnalyticsService (tracking de compartidos, clicks)
- [ ] PersistenceService (localStorage, sessionStorage)
- [ ] AuthService (autenticación de usuarios)
- [ ] APIService (comunicación con backend)

---

**Última actualización:** 2024 | Angular v20+ | TypeScript strict
