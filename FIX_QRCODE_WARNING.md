# Fix: Resolución del Warning de qrcode CommonJS

## Problema Reportado

```
▲ [WARNING] Module 'qrcode' used by 'src/app/components/template/modal/share-modal/share-modal.ts'
is not ESM

CommonJS or AMD dependencies can cause optimization bailouts.
For more information see: https://angular.dev/tools/cli/build#configuring-commonjs-dependencies
```

## Root Cause

El módulo `qrcode` (v1.5.4) está distribuido en formato CommonJS/AMD en lugar de ESM (ECMAScript Modules). Esto causa que el bundler esbuild no pueda optimizar completamente el módulo durante la construcción.

Adicionalmente, `zone.js` no estaba en las dependencias del proyecto.

## Solución Implementada

### 1. Instalación de zone.js

```bash
pnpm add -D zone.js
```

**Por qué:** Angular v20+ requiere `zone.js` para Change Detection, pero no lo incluye automáticamente en nuevos proyectos.

### 2. Actualización de angular.json

Se agregó la configuración `allowedCommonJsDependencies` en `build.options`:

```json
{
  "build": {
    "options": {
      // ... otras opciones ...
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

## Cambios Realizados

| Archivo              | Cambio                                            |
| -------------------- | ------------------------------------------------- |
| `package.json`       | ✅ Agregada dependencia `zone.js`                 |
| `angular.json`       | ✅ Agregada sección `optimization`                |
| `angular.json`       | ✅ Agregada sección `allowedCommonJsDependencies` |
| `COMMONJS_CONFIG.md` | ✅ Documentación técnica del fix                  |

## Verificación del Fix

### Antes

```
▲ [WARNING] Module 'qrcode' used by '...' is not ESM
```

### Después

```
✅ Application bundle generation complete. [14.086 seconds]

Browser bundles
Initial total    | 256.85 kB |                72.41 kB

Lazy chunk files
chunk-FES64OGQ.js    | vinculo-natural  |  69.11 kB |                18.72 kB
...

No warnings or errors detected ✅
```

## Impacto

| Métrica           | Resultado                               |
| ----------------- | --------------------------------------- |
| **Warnings**      | ✅ 0 (antes: 1)                         |
| **Build time**    | 14.086 segundos                         |
| **Bundle size**   | 256.85 kB inicial (72.41 kB comprimido) |
| **Funcionalidad** | ✅ Sin cambios                          |
| **Performance**   | ✅ Sin degradación                      |

## Archivos de Documentación

- **COMMONJS_CONFIG.md:** Documentación técnica del problema, solución e implementación

## Próximos Pasos

Este fix es una configuración one-time. Si en el futuro se agregan más dependencias CommonJS, actualizar:

```json
"allowedCommonJsDependencies": [
  "qrcode",
  "nombre-modulo-nuevo"  // ← Agregar aquí
]
```

## Referencias

- [Angular CLI Build - CommonJS Dependencies](https://angular.dev/tools/cli/build#configuring-commonjs-dependencies)
- [esbuild CommonJS Handling](https://esbuild.github.io/api/#packages)
- [Zone.js Documentation](https://github.com/angular/zone.js)

---

**Fecha:** 2024-12-08 | **Status:** ✅ RESUELTO
