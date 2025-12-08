# Arquitectura del Sistema de Invitaciones a Eventos

## Visión General

Sistema modular y escalable para generar invitaciones personalizables a eventos (bautizos, bodas, etc.) usando Angular v20+, TypeScript strict mode y principios SOLID.

**Principios clave:**
- Type-driven development: Los tipos definen contratos
- Componentes genéricos reutilizables
- Single Responsibility Principle (SRP)
- Inyección de dependencias centralizada
- Change detection OnPush para rendimiento

---

## Estructura de Carpetas

```
src/app/
├── components/
│   ├── event/                    # Componentes de eventos
│   ├── home/                     # Página de inicio
│   ├── shared/                   # Componentes compartidos (header, footer)
│   ├── template/                 # Base y plantillas de eventos
│   │   ├── template.base.ts      # Clase abstracta para todas las plantillas
│   │   ├── template.ts           # Componente base concreto
│   │   ├── section/              # Componente base para secciones
│   │   │   └── section.component.ts
│   │   ├── baby-shower/          # Tipo de evento: Baby Shower
│   │   │   └── vinculo-natural/  # Plantilla específica
│   │   ├── modal/                # Modales genéricos
│   │   │   ├── location-modal/
│   │   │   ├── share-modal/
│   │   │   └── collective-qr-payment/
│   │   └── module/               # Módulos reutilizables
│   │       ├── contact/
│   │       ├── countdown/
│   │       ├── galery/
│   │       ├── gifts/
│   │       ├── guests/
│   │       ├── info/
│   │       ├── itinerary/
│   │       ├── notes/
│   │       └── rsvp/
│   └── wizard/                   # Asistente de creación
├── services/                     # Capa de servicios
│   ├── invite.service.ts         # Gestión de invitaciones
│   ├── share.service.ts          # Funcionalidad de compartir
│   └── maps.service.ts           # Integración con mapas
├── types/                        # Sistema de tipos
│   ├── event/
│   │   ├── event.types.ts        # Tipo base Event
│   │   ├── baby-shower.types.ts  # Tipo BabyShower
│   │   └── wedding.types.ts      # Tipo Wedding (futuro)
│   └── common/
│       └── common.types.ts       # Tipos compartidos
├── constants/
│   └── demo.data.ts              # Datos de demostración
└── [archivos de configuración]
```

---

## Capas de Arquitectura

### 1. Capa de Tipos (Type System)

Define contratos y estructuras de datos. **Los tipos son la fuente de verdad.**

#### Tipos Base

**`Event` (event.types.ts)**
- Interfaz base para todos los eventos
- Propiedades: `hostName`, `babyName`, `date`, `venue`, `sections`, `design`, `contact`
- Función de guarda: `isValidEvent(obj): boolean`

```typescript
export type Event = {
  title: string;
  subtitle: string;
  photoUrl: string;
  date: Date;
  hostName: string;      // Gender-neutral
  babyName: string;
  venue: Venue;
  sections: Record<string, any>;
  design: DesignConfig;
  contact: Contact;
};

export function isValidEvent(event: unknown): boolean {
  // Validación con type guards
}
```

**`BabyShower` (baby-shower.types.ts)**
- Extiende `Event`
- Define secciones específicas: `dressCode`, `foodDetails`, `locationDetails`, `notes`, `rsvp`, `gift`, `gallery`, `instagram`, `sharing`
- Cada sección es configurable con `title`, `description`, `enabled`

```typescript
export type BabyShower = Event & {
  babyName: string;
  guests: string[];
  sections: BabyShowerSections;
};

export type BabyShowerSections = {
  dressCode?: SectionConfig;
  foodDetails?: SectionConfig;
  // ... otras secciones
  gift: {
    enabled: boolean;
    title: string;
    subtitle: string;
    ideas: Gift[];
    giftListUrl: string;
    giftListTag: string;
    enabledCollectiveGift: boolean;
    paymentQrCodeUrl: string;
    paymentQrCodeInstructions: string;
    instructions: string;
  };
};
```

#### Tipos Comunes (common.types.ts)

```typescript
export type Section = { enabled?: boolean; title?: string; description?: string };
export type Activity = { title?: string; name: string; time?: string };
export type Image = { url: string; alt: string };
export type Contact = { whatsappNumber?: number };
export type Venue = {
  name: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
};
export type DesignConfig = { colors?: Record<string, string>; galleryImages?: Image[] };
```

### 2. Capa de Servicios

Servicios reutilizables con responsabilidades bien definidas.

#### InviteService
```typescript
@Injectable({ providedIn: 'root' })
export class InviteService {
  getDemoData(): BabyShower
  loadEventById(eventId: string): Promise<Event>
  formatDate(date: Date): { day: number; month: string; year: number }
  getDateFromNow(daysFromNow: number): Date
  isValidEvent(event: unknown): boolean
  cloneEvent(event: Event): Event
}
```

**Responsabilidad:** Gestión de datos de eventos (carga, formateo, validación)

#### ShareService
```typescript
@Injectable({ providedIn: 'root' })
export class ShareService {
  copyToClipboard(text: string): Promise<boolean>
  shareViaWeb(shareData: ShareData): Promise<boolean>
  getWhatsAppShareUrl(message: string, phoneNumber?: string): string
  getFacebookShareUrl(url: string): string
  getInstagramShareUrl(hashtag: string): string
  getCurrentUrl(): string
  downloadElement/downloadImage(): void
}
```

**Responsabilidad:** Funcionalidad de compartir en redes sociales y exportación

#### MapsService
```typescript
export interface IMapsService {
  getMapUrl(latitude: number, longitude: number, zoom?: number): string
  getMapUrlFromAddress(address: string): string
  openMap(latitude: number, longitude: number, zoom?: number): void
}

@Injectable({ providedIn: 'root' })
export class GoogleMapsService implements IMapsService { }

@Injectable()
export class OpenStreetMapsService implements IMapsService { }
```

**Responsabilidad:** Integración con servicios de mapas

### 3. Capa de Componentes

Componentes ordenados jerárquicamente con TemplateBase como raíz.

#### TemplateBase (Clase Abstracta)

```typescript
@Directive()
export abstract class TemplateBase<T extends Event> implements OnInit, OnDestroy {
  protected eventData = signal<T | null>(null);
  protected isLoading = signal(false);
  protected errorMessage = signal<string | null>(null);
  protected destroy$ = new Subject<void>();

  abstract loadEventData(): void;
  protected formatDate(date: Date): FormattedDate { }
  protected getDateFromNow(daysFromNow: number): Date { }
  protected openEventLocation(): void { }
  protected getLocationUrl(): string | null { }
  protected shareEvent(title: string, description: string): Promise<void> { }
  protected copyEventUrl(): Promise<void> { }
  protected getWhatsAppShareUrl(message: string, phoneNumber?: string): string { }
  protected getFacebookShareUrl(): string { }
  protected getInstagramShareUrl(hashtag: string): string { }
}
```

**Beneficios:**
- Inyección centralizada de servicios
- Lifecycle management automático
- Métodos comunes para todas las plantillas de eventos
- Type-safe event handling

#### SectionComponent (Componente Genérico)

```typescript
@Component({
  selector: 'app-section',
  imports: [CommonModule],
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent<T = any> {
  config = input.required<SectionConfig<T>>();
  actionClicked = output<void>();
}

export type SectionConfig<T = any> = {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  content: T;
  link?: string;
  linkTag?: string;
  actionButton?: { label: string; action: () => void };
};
```

**Usos:**
- `Info`: Mostrar información con icono y descripción
- `Notes`: Listar notas con iconos
- `Itinerary`: Mostrar actividades con horarios

**Beneficio:** Reducción de ~60% de código en módulos comunes

#### VinculoNatural (Plantilla de Baby Shower)

```typescript
@Component({...})
export class VinculoNatural extends TemplateBase<BabyShower> {
  principalPhotoUrl = input<string>('...');
  eventDataInput = input<BabyShower | undefined>();

  isLocationModalOpen = signal(false);
  isShareModalOpen = signal(false);

  readonly currentEventDate = computed(() => {
    const event = this.eventData();
    return event ? this.formatDate(event.date) : defaultDate;
  });

  readonly locationData = computed(() => {
    const event = this.eventData();
    return event ? [...] : [];
  });

  protected loadEventData(): void {
    // Implementación específica para Baby Shower
  }

  openLocationModal(): void { }
  closeLocationModal(): void { }
  openShareModal(): void { }
  closeShareModal(): void { }
}
```

**Características:**
- Extiende `TemplateBase<BabyShower>`
- Usa `computed()` para datos derivados
- Gestión de modales integrada
- Zero startup delay: datos de demo en `ngOnInit()`

#### Módulos Reutilizables

**Info, Notes, Itinerary** ahora usan `SectionComponent`:

```typescript
@Component({...})
export class Info {
  title = input.required<string>();
  icon = input<string>();
  description = input.required<string>();
  link = input<string>();
  linkTag = input<string>();
  action = input<(() => void) | undefined>();

  protected sectionConfig = computed<SectionConfig>(() => ({
    title: this.title(),
    icon: this.icon(),
    description: this.description(),
    // ... más props
  }));
}
```

---

## Flujo de Datos

### Carga de Evento

```
VinculoNatural (component)
  ↓
ngOnInit() → loadEventData()
  ↓
eventDataInput() ? (use input) : inviteService.getDemoData()
  ↓
eventData signal = BabyShower
  ↓
currentEventDate computed = formatDate(eventData.date)
locationData computed = buildActivities(eventData.venue)
  ↓
Template renders with eventData() and computed signals
```

### Compartir Evento

```
VinculoNatural.openShareModal()
  ↓
ShareModal abierto
  ↓
Usuario hace clic en "Compartir vía WhatsApp"
  ↓
shareService.getWhatsAppShareUrl(message)
  ↓
Abre WhatsApp con URL pre-llenada
```

### Personalización

```
Demo data (BABY_SHOWER_DEMO)
  ↓
Usuarios modifican tipo (sections.gift.title, etc.)
  ↓
InviteService.cloneEvent() → deep copy
  ↓
VinculoNatural muestra datos personalizados
```

---

## Principios SOLID Aplicados

### Single Responsibility
- **InviteService:** Solo gestión de invitaciones
- **ShareService:** Solo compartir/social media
- **MapsService:** Solo integración de mapas
- **Info component:** Solo mostrar información estilizada
- **VinculoNatural:** Solo orquestar baby shower

### Open/Closed
- `SectionComponent<T>` abierto a nuevos tipos, cerrado a modificación
- `TemplateBase<T>` extensible para nuevos tipos de eventos

### Liskov Substitution
- `GoogleMapsService`, `OpenStreetMapsService` intercambiables
- Nuevos event types pueden extender `Event` y ser soportados por `TemplateBase`

### Interface Segregation
- `IMapsService` define solo métodos necesarios
- Inputs opcionales usando `input<string>()` vs `input.required<string>()`

### Dependency Inversion
- Componentes dependen de abstracciones (`TemplateBase`, `IMapsService`)
- No acoplamiento a implementaciones concretas

---

## Convenciones de Código

### Nomenclatura

| Aspecto | Formato | Ejemplo |
|---------|---------|---------|
| Propiedades de código | camelCase (EN) | `wishlistLink`, `babyName` |
| Etiquetas UI | Configurables (ES) | `"Ver lista de regalos"` |
| Archivos de componentes | kebab-case | `baby-shower.ts`, `share-modal.ts` |
| Tipos | PascalCase | `BabyShower`, `Event`, `Activity` |
| Constantes | UPPER_SNAKE_CASE | `BABY_SHOWER_DEMO` |
| Métodos privados | _leadingUnderscore | `_buildLocationData()` |

### Implementación de Servicios

```typescript
// ✅ Correcto
@Injectable({ providedIn: 'root' })
export class MyService {
  private readonly dependency = inject(OtherService);
  
  method(): void {
    const result = this.dependency.getValue();
  }
}

// ❌ Incorrecto
@Injectable({ providedIn: 'root' })
export class MyService {
  constructor(private dep: OtherService) {} // Use inject()
}
```

### Implementación de Componentes

```typescript
// ✅ Correcto
@Component({
  selector: 'app-my',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent {
  count = input<number>(0);
  onCountChange = output<number>();
  isDarkMode = signal(false);
  doubled = computed(() => this.count() * 2);
}

// ❌ Incorrecto
@Component({
  standalone: true // No es necesario en Angular v20+
})
export class MyComponent implements OnInit {
  @Input() count: number; // Use input()
  @Output() onChange = new EventEmitter(); // Use output()
  ngOnInit() { } // Usar TemplateBase en su lugar
}
```

---

## Roadmap de Desarrollo

### ✅ Completadas (Fases 1-3)
- [x] Type system (Event base, BabyShower, common types)
- [x] Servicios (Invite, Share, Maps)
- [x] Template base class
- [x] SectionComponent genérico
- [x] Nomenclatura unificada
- [x] VinculoNatural refactorizado

### 🔲 Próximas (Fases 4-6)
- [ ] LocationModule (separar lógica de ubicación)
- [ ] SharingModule (centralizar compartir)
- [ ] ModalService (gestión de modales)
- [ ] Documentation (ARCHITECTURE.md completo, SERVICE_LAYER.md)

### 🔲 Futuro (Fases 7+)
- [ ] Wedding event type
- [ ] Cumpleaños, Reunión de empresa, etc.
- [ ] Builder/Wizard mejorado
- [ ] Persistencia (almacenar eventos)
- [ ] API backend (cargar eventos desde servidor)

---

## Performance & Optimizaciones

### Signals & Change Detection
- Todos los componentes usan `ChangeDetectionStrategy.OnPush`
- Computed signals reutilizan valores previos
- No hay subscriptions innecesarias a RxJS

### Lazy Loading
- Rutas lazy-loaded para feature modules
- Modales renderizados solo cuando se abren

### Bundle Size
- Imports selectivos (no wildcard imports)
- Tree-shaking habilitado
- Componentes standalone (sin NgModules)

---

## Testing

### Unit Tests
```typescript
describe('VinculoNatural', () => {
  it('should load demo data when no input provided', () => {
    const component = new VinculoNatural(...);
    expect(component.eventData()).toBeDefined();
  });

  it('should use input data when provided', () => {
    const inputEvent = BABY_SHOWER_DEMO;
    component.eventDataInput = () => inputEvent;
    component.loadEventData();
    expect(component.eventData()).toBe(inputEvent);
  });
});
```

### E2E Tests
- Validar flujo completo: carga → modal de ubicación → compartir
- Verificar que todos los datos se muestran correctamente
- Probar responsive en diferentes tamaños de pantalla

---

## Recursos Adicionales

- **NAMING_CONVENTION.md:** Estándares de nomenclatura con ejemplos
- **SERVICE_LAYER.md:** Documentación detallada de servicios
- **type-definitions.md:** Guía de tipos disponibles
- **component-hierarchy.md:** Árbol de componentes y relaciones

---

## Preguntas Frecuentes

**P: ¿Cómo agregar un nuevo tipo de evento?**
A: Crear nuevo tipo extendiendo `Event`, implementar `sections` específicos, crear componente extendiendo `TemplateBase<NewEvent>`.

**P: ¿Cómo personalizar colores/estilos?**
A: Modificar `design` config en el tipo de evento o usar CSS variables en `SectionComponent`.

**P: ¿Cómo agregar una nueva sección?**
A: Agregar a `BabyShowerSections`, importar módulo en `VinculoNatural`, agregar en template.

**P: ¿Se puede usar sin datos de demo?**
A: Sí, pasar `eventDataInput` al componente o implementar `loadEventData()` para cargar desde API.

---

**Última actualización:** 2024 | Angular v20+ | TypeScript strict
