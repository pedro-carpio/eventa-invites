# Convención de Nombres - Eventa Invites

Este documento establece las convenciones de nomenclatura para el proyecto Eventa Invites, asegurando consistencia, legibilidad y mantenibilidad del código.

## Regla Principal

**Código (TypeScript/JavaScript)**: `camelCase` en **inglés**  
**Texto UI (Labels/Mensajes)**: Español con tipografía adecuada

## Propiedades de Objetos

### ✅ CORRECTO (camelCase en inglés)

```typescript
// Tipos y objetos
hostName: string; // Neutro: anfitrión/a
babyName: string; // Nombre del bebé
durationHours: number; // Duración en horas
whatsappNumber: number; // Número de WhatsApp
instagramTag: string; // Tag de Instagram
paymentQrCodeUrl: string; // URL del código QR
paymentQrCodeInstructions: string;
giftListUrl: string; // URL de lista de regalos
giftListTag: string; // Etiqueta de lista
enabledCollectiveGift: boolean; // Regalo colectivo habilitado
maxPlusOnes: number; // Máximo de acompañantes
additionalInfo: string; // Información adicional
wishlistLink: string; // Enlace a lista de deseos
wishlistTag: string; // Etiqueta de lista
collectiveGift: boolean; // Regalo colectivo

// Propiedades booleanas: usar prefijo is/enabled
isCollectiveModalOpen: boolean;
enabledCollectiveGift: boolean;
enabled: boolean;
```

### ❌ INCORRECTO (snake_case)

```typescript
// NO USAR:
host_name; // ← use hostName
baby_name; // ← use babyName
duration_hours; // ← use durationHours
whatsapp_number; // ← use whatsappNumber
instagram_tag; // ← use instagramTag
payment_qr_code_url; // ← use paymentQrCodeUrl
gift_list_url; // ← use giftListUrl
max_plus_ones; // ← use maxPlusOnes
aditional_info; // ← use additionalInfo (+ corregir typo)
wishlist_link; // ← use wishlistLink
wishlist_tag; // ← use wishlistTag
collective_gift; // ← use collectiveGift
```

## Componentes Angular

### Selectores

```typescript
// ✅ CORRECTO: kebab-case
selector: 'app-gifts',
selector: 'app-location-modal',
selector: 'app-share-modal',
```

### Input/Output Properties

```typescript
// ✅ CORRECTO: camelCase en público (templates)
@Input() hostName: string;           // En template: [hostName]="..."
@Output() giftSelected = new EventEmitter();

// Nueva forma (preferida):
hostName = input<string>();         // En template: [hostName]="..."
giftSelected = output<Gift>();
```

### Señales (Signals)

```typescript
// ✅ CORRECTO: camelCase
isCollectiveModalOpen = signal<boolean>(false);
currentEventData = signal<BabyShower>(BABY_SHOWER_DEMO);
selectedGift = signal<Gift | null>(null);

// ❌ NO:
is_collective_modal_open = signal<boolean>(false);
current_event_data = signal<BabyShower>(...);
```

## Tipos (Type Definitions)

### Nombres de Tipos

```typescript
// ✅ CORRECTO: PascalCase
type Event = { ... }
type BabyShower = { ... }
type SharingMetadata = { ... }
interface ShareData { ... }

// ❌ NO:
type event = { ... }
type baby_shower = { ... }
```

### Propiedades en Tipos

```typescript
// ✅ CORRECTO
type BabyShower = {
  hostName: string;
  babyName: string;
  enabledCollectiveGift: boolean;
  paymentQrCodeUrl?: string;
  sections: BabyShowerSections;
};

// ❌ NO:
type BabyShower = {
  host_name: string;
  baby_name: string;
  enabled_collective_gift: boolean;
  payment_qr_code_url?: string;
};
```

## Archivos y Directorios

### Nombres de Archivos

```
// ✅ CORRECTO: kebab-case
src/app/components/template/baby-shower/vinculo-natural.ts
src/app/types/event/baby-shower.types.ts
src/app/components/template/modal/share-modal/share-modal.ts
src/app/constants/demo.data.ts

// ❌ NO:
src/app/components/template/babyShower/vinculoNatural.ts
src/app/types/event/baby_shower.types.ts
src/app/components/template/modal/share_modal/share_modal.ts
src/app/constants/demo_data.ts
```

### Nombres de Directorios

```
// ✅ CORRECTO: kebab-case
src/app/components/
src/app/components/template/
src/app/components/shared/
src/app/components/template/baby-shower/
src/app/components/template/modal/
src/app/components/template/module/

// ❌ NO:
src/app/components_template/
src/app/template_components/
src/app/babyShower/ (use baby-shower)
```

## Textos UI (Labels)

### Labels en Español

Todos los textos visibles al usuario deben estar en **español correcto**. Estos textos deben ser **configurables a través de tipos**, no hardcodeados en templates.

```typescript
// ✅ CORRECTO: Configurables en tipos
sections: {
  gift: {
    title: 'Regalos',                    // Label principal
    subtitle: 'Si deseas hacerme un regalo...',
    giftListTag: 'También tengo una lista de Casa Ideas',
  },
  dressCode: {
    title: 'Dress code',                 // Se puede dejar en inglés
    description: 'Puedes venir como quieras ❤️',
  },
  instagram: {
    title: 'Comparte tus fotos y videos',
    description: 'Comparte tus fotos usando',
    tag: 'BabyShower2025',
  }
}

// Template:
<app-gifts [title]="event.sections.gift.title" ...></app-gifts>
// Muestra: "Regalos"
```

### ❌ NO: Hardcodeado en Templates

```typescript
// EVITAR:
<h2>Regalos</h2>                    // ← hardcodeado
<p>Si deseas hacerme un regalo...</p> // ← hardcodeado

// PREFERIR:
<h2>{{ event.sections.gift.title }}</h2>
<p>{{ event.sections.gift.subtitle }}</p>
```

## Funciones y Métodos

### Nombres

```typescript
// ✅ CORRECTO: camelCase
loadEventData(): void
calculateDate(daysFromNow: number): Date
openCollectiveGiftModal(): void
closeLocationModal(): void
getLocationData(): Activity[]
formatDate(date: Date): FormattedDate

// ❌ NO:
load_event_data(): void
calculate_date(): void
open_collective_gift_modal(): void
```

### Funciones Auxiliares

```typescript
// ✅ CORRECTO: nombres descriptivos
function getEventDate(daysFromNow: number): Date;
function isValidBabyShower(obj: unknown): obj is BabyShower;
function generateBabyShowerDemo(overrides?: Partial<BabyShower>): BabyShower;

// ❌ NO:
function get_event_date();
function is_valid_baby_shower();
function generate_baby_shower_demo();
```

## Constantes

### Valores Constantes

```typescript
// ✅ CORRECTO: UPPER_SNAKE_CASE para constantes globales
const DEFAULT_TIMEZONE = 'America/La_Paz';
const MAX_PLUS_ONES_DEFAULT = 1;
const BABY_SHOWER_DEMO: BabyShower = { ... };

// En templates/código:
const apiBaseUrl = 'https://api.example.com';  // camelCase si no es global
const isProduction = process.env.NODE_ENV === 'production';
```

## Resumen Rápido

| Contexto                     | Formato            | Ejemplo                                 |
| ---------------------------- | ------------------ | --------------------------------------- |
| **Propiedades de objeto**    | `camelCase`        | `hostName`, `babyName`                  |
| **Métodos/funciones**        | `camelCase`        | `loadEventData()`                       |
| **Tipos/Interfaces**         | `PascalCase`       | `Event`, `BabyShower`                   |
| **Selectores de componente** | `kebab-case`       | `app-gifts`                             |
| **Archivos**                 | `kebab-case`       | `baby-shower.ts`                        |
| **Directorios**              | `kebab-case`       | `baby-shower/`                          |
| **Constantes globales**      | `UPPER_SNAKE_CASE` | `BABY_SHOWER_DEMO`                      |
| **Textos UI**                | Español            | `'Regalos'`, `'Confirma tu asistencia'` |

## Verificación

### Comandos útiles

```bash
# Buscar snake_case en .ts files
grep -r "[a-zA-Z]_[a-z]" src/app --include="*.ts" | grep -v "America/La_Paz" | grep -v "node_modules"

# Buscar propiedades sin camelCase
grep -rE "@Input\|@Output\|= input|= output" src/app --include="*.ts"
```

## Excepciones

1. **Strings literales**: `'America/La_Paz'` (zona horaria real)
2. **URLs/Identifiers externos**: pueden usar formatos del servicio externo
3. **Nombres de terceros**: mantener formato original (ej: `WhatsApp`)
4. **Historiales/Herencia**: migraciones gradualmente

## Actualización de Código

Cuando encuentres código que no siga estas convenciones:

1. Actualizar propiedades a `camelCase`
2. Actualizar templates para usar nuevos nombres
3. Mantener tipos sincronizados
4. Actualizar documentación
5. Verificar que no hay errores de compilación

Ejemplo de refactorización:

```typescript
// ANTES:
wishlist_link = input<string>('');
aditional_info = input<string>('');
collective_gift = input<boolean>();

// DESPUÉS:
wishlistLink = input<string>('');
additionalInfo = input<string>(''); // + corregir typo
collectiveGift = input<boolean>();
```

## Referencias

- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
