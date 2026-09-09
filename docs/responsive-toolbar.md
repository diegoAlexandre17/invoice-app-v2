# Toolbar responsive (DataTable + acciones)

La toolbar de las tablas (buscador + filtros + acciones) se adapta al espacio
**usando container queries**, no breakpoints de ventana. La clave: la toolbar no
ocupa toda la pantalla — le resta el sidebar (~256px, y encima colapsable). Los
breakpoints de ventana (`sm/md/lg`) "mienten" sobre el ancho real disponible; un
`@container` mide el ancho **real** del contenedor de la toolbar.

> Requiere Tailwind 4 (container queries nativos, sin plugin).

## Las dos piezas

1. **`@container` en `DataTable`** — el header se declara contenedor. Todos los
   `@lg:`, `@4xl:` (acá y en las acciones que se le pasan) miden ESE contenedor,
   no la ventana. Por eso es inmune al colapso del sidebar.
2. **`flex-1 + min-w` en cada control** — en vez de anchos fijos (`w-45`, `w-60`)
   que dejan huecos, los controles se estiran para llenar la fila y envuelven de
   a uno cuando no caben.

## Los dos "diales" (breakpoints independientes)

| Dial | Dónde | Qué controla |
|------|-------|--------------|
| `@4xl` (896px de contenedor) | `DataTable.tsx` | Buscador y acciones: apilados en filas ↔ dos columnas (buscador izq / acciones der). |
| `@lg` (512px de contenedor) | vista que consume `DataTable` (ej. `InvoiceTable.tsx`) | Acciones internas: columna mobile ↔ fila con wrap fluido. |

## Comportamiento por ancho del contenedor

- **Mobile / muy angosto**: todo en columna, cada control su fila `w-full`.
- **Medio**: acciones en fila que envuelven de a una (`flex-1` las estira, sin huecos).
- **Ancho** (`@4xl`+): dos columnas — buscador fijo (`w-72`) a la izquierda,
  acciones en línea a la derecha.

## Cómo replicar en una toolbar nueva

El contenedor (`DataTable`) ya trae el `@container` y el corte `@4xl` gratis: toda
tabla que use `DataTable` lo hereda. Solo armás el bloque de `actions` con este
patrón:

```tsx
// Contenedor de acciones: flex-wrap va ACÁ (regla del padre)
<div className="flex flex-col gap-2 @lg:flex-row @lg:flex-wrap">
  {/* Cada control: flex-1 + min-w van ACÁ (regla del hijo) */}
  <SelectTrigger className="w-full @lg:w-auto @lg:flex-1 @lg:min-w-40" />
  <div className="w-full @lg:flex-1 @lg:min-w-52"><DateRangePicker … /></div>
  <Button className="w-full @lg:w-auto @lg:flex-1 @lg:min-w-32" />
</div>
```

Reglas del patrón:

- **`flex-wrap`** va en el **contenedor** (cómo acomodo a mis hijos).
- **`flex-1`** va en cada **hijo** (cuánto crezco dentro de mi fila).
- **`min-w-XX`** es el piso: el control no se espachurra por debajo de eso; cuando
  la fila no puede darle su mínimo a todos, el `flex-wrap` tira uno abajo.
- **`w-full`** por debajo de `@lg`: en mobile cada control ocupa su fila completa
  (ahí NO usamos `min-w`, así se adapta a cualquier ancho sin desbordar).

Los valores de `min-w` se calibran a mano según cuántos filtros tenga la toolbar.

## Decisiones de diseño (el porqué)

| Decisión | Razón |
|----------|-------|
| Container queries, no `sm/md/lg` | La toolbar mide menos que la ventana (sidebar) y el sidebar colapsa. La ventana no refleja el espacio real; el contenedor sí. |
| `flex-1 + min-w`, no anchos fijos | Los anchos fijos no rellenan la fila → huecos en blanco. `flex-1` reparte y estira; `min-w` protege la legibilidad y dispara el wrap. |
| `w-full` en mobile (sin `min-w`) | En anchos muy chicos, `min-w` desbordaría. `w-full` se adapta a cualquier ancho. |
| Dos diales separados (`@lg` acciones, `@4xl` layout) | Las acciones se acomodan mucho antes de que el layout entero pase a dos columnas. |
| **No** abstraer en `<Toolbar>` todavía | YAGNI: hay un solo caso real. Se abstrae cuando aparezca la 2da/3ra toolbar, con datos reales. |

## Verificación rápida

- [ ] En ancho grande: buscador izquierda + acciones en una línea a la derecha.
- [ ] Al achicar: las acciones envuelven de a una, sin huecos en blanco.
- [ ] En mobile: cada control ocupa su propia fila, full-width.
- [ ] Colapsar el sidebar reacomoda la toolbar (prueba de que mide el contenedor).
- [ ] `yarn build` pasa sin errores.

## Archivos

| Archivo | Rol |
|---------|-----|
| `src/components/shared/DataTable.tsx` | Declara el `@container` y el corte `@4xl` a dos columnas. Reutilizable por toda tabla. |
| `src/views/invoices/InvoiceTable.tsx` | Ejemplo de bloque `actions` con el patrón `@lg` + `flex-1/min-w`. |
