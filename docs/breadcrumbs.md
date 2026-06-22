# Migas de pan (breadcrumbs)

Las migas se arman desde la **definición de cada ruta**, no parseando la URL.
Cada ruta declara su label con `handle: crumb("clave.i18n")` y el componente
`Breadcrumbs` las lee con `useMatches()` y las traduce.

> Router en modo data (`createBrowserRouter`). Sin React Query todavía: hoy las
> migas son **estáticas** (texto fijo por ruta, no dependen de datos cargados).

## Cómo agregar una miga a una ruta nueva

1. Agregá la clave de traducción en `src/i18n/locales/es.json` y `en.json`
   (dentro de `navigation`).
2. En `src/router/Router.tsx`, sumá `handle: crumb("navigation.tuClave")` a la ruta.
3. Listo. La miga aparece sola al navegar a esa ruta. No se toca `Breadcrumbs.tsx`.

```ts
// src/router/Router.tsx
{
  path: SEGMENTS.invoices,
  element: <Invoices />,
  handle: crumb("navigation.invoices"), // <- esto es todo
}
```

Si la clave no existe en el i18n, **TypeScript falla el build** (no es un bug:
es la red de seguridad de `ParseKeys`). Agregá la clave primero.

## Piezas y responsabilidades

| Archivo | Rol |
|---------|-----|
| `src/router/types.ts` | Define el tipo `CrumbHandle` y el helper `crumb()`. |
| `src/router/Router.tsx` | Cada ruta declara `handle: crumb("...")`. Fuente de verdad de los labels. |
| `src/components/layouts/Breadcrumbs.tsx` | Lee los matches activos, filtra los que tienen `crumb`, traduce y renderiza. |
| `src/components/layouts/Navbar.tsx` | Monta `<Breadcrumbs />` junto al `SidebarTrigger`. |
| `src/i18n/locales/{es,en}.json` | Textos de cada clave bajo `navigation`. |

## Cómo funciona (flujo)

1. Navegás a `/admin/customers`.
2. React Router resuelve la cadena de rutas activas (`/admin` -> `customers`).
3. `useMatches()` devuelve esos matches, cada uno con su `handle`.
4. `Breadcrumbs` se queda solo con los que tienen `handle.crumb` (vía `hasCrumb`).
5. Traduce cada clave con `t(...)` y arma la lista.
6. El último item se muestra sin link (`BreadcrumbPage`); el resto son `Link`.

## Decisiones de diseño (el porqué)

| Decisión | Razón |
|----------|-------|
| `crumb` guarda la **clave** i18n, no el texto | El idioma puede cambiar en runtime. Traducir en el componente (que es reactivo) mantiene las migas en el idioma actual. |
| Se traduce en `Breadcrumbs`, no en el router | `t` vive donde nace (el componente con `useTranslation`). El router no necesita conocer `t`. |
| Helper `crumb()` en vez de `satisfies` en cada ruta | Más corto, misma validación de clave, y centraliza la forma del handle. |
| Tipo `ParseKeys` para la clave | Valida contra las claves reales del i18n. Un typo se detecta en compilación. |
| `hasCrumb` (type guard) | `useMatches()` devuelve `handle` como `unknown`. El guard confirma en runtime que el handle tiene `crumb` antes de usarlo. |

## Verificación rápida

- [ ] La miga aparece al navegar a la ruta.
- [ ] El último segmento NO es un link; los anteriores SÍ.
- [ ] Cambiar de idioma actualiza el texto de las migas.
- [ ] Una clave inexistente en `crumb("...")` rompe el build (esperado).
- [ ] `npm run build` pasa sin errores de TS.

## Extender el handle con más metadata

`handle` es un espacio libre (React Router lo tipa como `unknown`). Podés sumar
props además de `crumb` —ícono, título de pestaña, flags de auth— y que distintos
consumidores lean lo suyo vía `useMatches()`.

```ts
// src/router/types.ts
export type CrumbHandle = {
  crumb: ParseKeys;
  icon?: LucideIcon; // ejemplo de prop futura
};
```

Si el handle deja de ser "solo migas", conviene renombrar el tipo a algo más
general (ej. `RouteHandle`). No lo hagas antes de necesitarlo.

## Próximo paso: migas dinámicas (rutas con `:id`)

Para mostrar el nombre real en vez del id (ej. `/admin/customers/:id` ->
"ACME S.A." en lugar de "2") hace falta cargar el dato. Plan previsto:

1. Instalar React Query.
2. La ruta `:id` suma un `loader` que precarga el dato.
3. `crumb` pasa de clave fija a derivar el label del dato cargado.

Mientras eso no exista, mantené las migas estáticas como están acá.
