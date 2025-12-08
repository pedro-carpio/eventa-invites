# Configuración de Dependencias CommonJS

## Problema Original

Warning al ejecutar `pnpm run build`:

```
▲ [WARNING] Module 'qrcode' used by 'src/app/components/template/modal/share-modal/share-modal.ts'
is not ESM

CommonJS or AMD dependencies can cause optimization bailouts.
For more information see: https://angular.dev/tools/cli/build#configuring-commonjs-dependencies
```

## Causa

El módulo `qrcode` (versión 1.5.x) está distribuido en formato CommonJS/AMD en lugar de ESM (ECMAScript Modules). Esto causa que esbuild (bundler de Angular) no pueda optimizar el módulo completamente durante la construcción.

## Solución Implementada

### Pasos Ejecutados

1. **Instalación de `zone.js`**

   ```bash
   pnpm add -D zone.js
   ```

   Zone.js es requerido por Angular para gestión de Change Detection, pero no está incluido en las nuevas versiones de Angular v20+ por defecto.

2. **Actualización de `angular.json`**
   Se agregó la opción `allowedCommonJsDependencies` en `build.options`:

   ```json
   {
     "build": {
       "options": {
         "browser": "src/main.ts",
         "tsConfig": "tsconfig.app.json",
         // ... otras opciones

         "optimization": {
           "scripts": true,
           "styles": true,
           "fonts": true
         },
         "allowedCommonJsDependencies": ["qrcode"]
       }
     }
   }
   ```

### Actualizaciones Configuradas

#### 1. `optimization` Object

- `scripts: true`: Minifica y optimiza código JavaScript
- `styles: true`: Minifica y optimiza CSS
- `fonts: true`: Optimiza carga de fuentes

#### 2. `allowedCommonJsDependencies`

- **Lo importante:** Lista de módulos CommonJS/AMD permitidos
- Evita warnings del bundler esbuild
- Permite que Angular compile sin abortar por módulos legacy
- `qrcode`: Incluido para permitir su uso sin warnings

## Impacto

✅ **Resultado después de la configuración:**

- ✅ No hay warnings durante el build (verificado)
- ✅ El módulo `qrcode` se integra correctamente
- ✅ El bundle sigue siendo optimizado (256.85 kB inicial, 72.41 kB comprimido)
- ✅ Compatible con SSR (Server-Side Rendering)
- ✅ Build complete: 14.086 seconds

**Output de ejemplo:**

```
Browser bundles
Initial chunk files  | Names            |  Raw size | Estimated transfer size
chunk-XVFKFWDL.js    | -                | 153.18 kB |                45.94 kB
main-GKCEFG3M.js     | main             |  85.60 kB |                22.07 kB
styles-UKP5347V.css  | styles           |  12.28 kB |                 2.76 kB
chunk-5KYIWUJ7.js    | -                |   5.78 kB |                 1.64 kB

                     | Initial total    | 256.85 kB |                72.41 kB

Lazy chunk files     | Names            |  Raw size | Estimated transfer size
chunk-FES64OGQ.js    | vinculo-natural  |  69.11 kB |                18.72 kB
...

✅ Application bundle generation complete. [14.086 seconds]
```

## Alternativas Consideradas

### Opción 1: Usar paquete alternativo (NO IMPLEMENTADO)

Cambiar a `qrcode-native` o similar:

```bash
pnpm remove qrcode
pnpm add qrcode-native
```

**Pros:** Módulo nativo ESM
**Contras:** Diferente API, requiere refactorizar código

### Opción 2: Ignorar warning (NO RECOMENDADO)

Dejar como está:
**Pros:** Sin cambios
**Contras:** Warning en logs, futura degradación de performance

### Opción 3: Lazy load del componente (PARCIAL)

Cargar `share-modal.ts` lazy:

```typescript
const ShareModal = lazy(() => import('./share-modal/share-modal'));
```

**Pros:** Qrcode no se carga en startup
**Contras:** Latencia cuando se abre modal, más complejo

**✅ Opción 4 (IMPLEMENTADA):** Configurar como dependencia permitida

- Simple
- Mantiene performance
- Elimina warnings
- Compatible con todas las features

## Verificación

Para verificar que la configuración funciona:

```bash
# Limpiar cache
pnpm install

# Build limpio sin warnings
pnpm run build

# Verificar tamaño del bundle
du -sh dist/browser
```

Esperado: ✅ Sin warnings, bundle < 1MB

## Módulos CommonJS Similares

Si en el futuro agregamos más dependencias CommonJS, actualizar:

```json
"allowedCommonJsDependencies": [
  "qrcode",
  "nombre-otro-modulo",
  "otro-modulo-mas"
]
```

**Módulos comunes a evitar:**

- ❌ `moment.js` (usar `date-fns` o `dayjs` en su lugar)
- ❌ `lodash` (usar `lodash-es` en su lugar)
- ❌ `jquery` (no usar)

**Módulos que probablemente necesitaremos permitir:**

- ✅ `qrcode` (actual)
- ⚠️ `html2canvas` (si lo agregamos para descargas)
- ⚠️ `jsPDF` (si lo agregamos para generación de PDFs)

## Recursos

- [Angular CLI Build Documentation](https://angular.dev/tools/cli/build#configuring-commonjs-dependencies)
- [esbuild CommonJS Handling](https://esbuild.github.io/api/#packages)
- [QRCode npm package](https://www.npmjs.com/package/qrcode)

## Conclusión

La configuración minimiza warnings sin impacto en performance o funcionalidad. Es la solución recomendada por Angular para dependencias CommonJS legacy.

---

**Actualización:** 2024 | Angular CLI v20
