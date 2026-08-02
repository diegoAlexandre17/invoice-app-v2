# AGENTS.md — invoice-app

Contrato operativo para agentes de IA que trabajen en este repositorio. Leelo completo antes de escribir código.

---

## 1. Qué es este proyecto

Una **aplicación de gestión de facturas** de página única (SPA). Los administradores se autentican, gestionan los datos de su empresa, sus clientes y (eventualmente) sus facturas. El backend actual es **Supabase**, pero el código está deliberadamente diseñado para que Supabase pueda reemplazarse por un backend propio sin tocar la lógica de negocio ni la UI.

- **Repo**: https://github.com/diegoAlexandre17/invoice-app-v2
- **Tipo**: SPA (sin SSR, `rsc: false`)
- **Idioma de los artefactos de código**: inglés (identificadores, copy de UI vía claves i18n). Los comentarios en línea están actualmente en español — respetá el idioma del archivo que estés tocando.

---

## 2. Stack tecnológico

| Área | Elección | Notas |
|---|---|---|
| Lenguaje | TypeScript ~6.0 | `strict: true`, `target es2023`, `moduleResolution: bundler` |
| Framework UI | React 19.2 | Solo componentes de función + hooks |
| Build | Vite 8 | `@vitejs/plugin-react` |
| Estilos | Tailwind CSS 4 | Vía `@tailwindcss/vite`, variables CSS, `baseColor: neutral` |
| Componentes | shadcn (estilo `radix-nova`) + Radix UI | Los primitivos viven en `src/components/ui/` |
| Íconos | lucide-react | |
| Routing | react-router 7.17 | Config en `src/router/` |
| Estado de servidor | TanStack Query 5 | El ÚNICO gestor de server-state. Nada de Redux/Zustand |
| Tablas | TanStack Table 8 | Envuelto por `src/components/shared/DataTable.tsx` |
| Formularios | react-hook-form + zod (`@hookform/resolvers`) | El schema de zod es la única fuente de verdad de validación |
| Backend | Supabase (`@supabase/supabase-js`) | Aislado — ver §4 |
| i18n | i18next + react-i18next | `es` / `en`, claves en `src/i18n/locales/` |
| Toasts / alertas | sonner + sweetalert2 | |
| Fuentes | `@fontsource-variable/geist` | |
| Gestor de paquetes | **yarn** | `yarn.lock` es la fuente autoritativa — NO usar npm/pnpm |

---

## 3. Comandos

```bash
yarn dev       # Servidor de desarrollo de Vite
yarn build     # tsc -b && vite build  → verificación FINAL (tipos + bundle de producción)
yarn lint      # ESLint (flat config)
yarn preview   # preview del build de producción
```

- **No hay test runner.** No existe vitest/jest/playwright. No inventes comandos de test ni importes librerías de testing salvo que el usuario pida explícitamente configurar testing.
- **Verificación en dos niveles** (no hace falta el build completo para cada chequeo):
  - **Iterativo (rápido, ~3-4s)**: `yarn tsc -b` + `yarn lint`. `tsc -b` solo chequea tipos (todos los tsconfig tienen `noEmit`, no genera archivos); ESLint cubre reglas que `tsc` no ve (react-hooks, etc.). Usá esto mientras trabajás.
  - **Final (antes de dar por terminado / pushear)**: `yarn build`. Además de los tipos, confirma que el bundle de producción compila (Vite). Es el sello de la verdad.
- No hay formateador configurado (prettier/biome). No agregues uno sin que te lo pidan. Respetá el formato existente.

---

## 4. Arquitectura — Hexagonal / Clean por feature (CANÓNICO)

Todo el trabajo nuevo vive en `src/features/<feature>/` con cuatro capas. Las dependencias apuntan **hacia adentro** (presentation → application → domain; infrastructure → domain). El domain nunca importa React, Supabase ni ninguna librería.

```
src/features/<feature>/
├── domain/
│   ├── entities/            # Tipos de negocio. TS puro. TUS nombres de campos, no los del backend.
│   └── repositories/        # Interfaces (contratos). ej. CustomerRepository
├── application/
│   └── useCases/            # Una función por caso de uso. Recibe un repositorio y lo invoca.
├── infrastructure/
│   ├── Supabase<X>Repository.ts   # Implementa la interfaz del domain usando Supabase
│   └── <x>RepositoryInstance.ts   # Singleton instanciado del repositorio
└── presentation/
    └── hooks/               # Hooks de React: envuelven los casos de uso en useQuery/useMutation
```

### Las reglas que hacen que esto funcione (no las rompas)

1. **`domain/` es puro.** Sin imports de React, Supabase, TanStack ni ninguna librería externa. Solo otros tipos del domain. Las entidades describen el negocio, no la forma de la respuesta del backend.
2. **`domain/repositories/` define solo interfaces.** La capa de application depende de la interfaz, nunca de una clase concreta.
3. **`application/useCases/` son funciones delgadas** que reciben un repositorio como primer argumento y orquestan la lógica de dominio. Sin React, sin Supabase.
4. **`infrastructure/` es el único lugar que conoce Supabase.** La implementación del repositorio traduce filas de Supabase ⇄ entidades del domain (ej. `id_number` ⇄ `identification`, `created_at` ⇄ `createdAt`). El mapeo de nombres de columna sucede ACÁ, en ningún otro lado.
5. **`presentation/hooks/` son el puente a React.** Importan el caso de uso + el singleton del repositorio y los envuelven en `useQuery`/`useMutation`. Los componentes consumen estos hooks y nunca llaman directamente a casos de uso ni repositorios.

### Implementación de referencia
`src/features/customers/` es el corte vertical de referencia (gold standard). Al construir una feature nueva, copiá su forma:
- `domain/entities/Customer.ts` — entidad + un objeto de params (`GetCustomersParams`) en lugar de argumentos sueltos, para que la firma pueda crecer sin romperse.
- `domain/repositories/CustomerRepository.ts` — el contrato.
- `application/useCases/*` — un archivo por operación.
- `infrastructure/SupabaseCustomerRepository.ts` — mapeo + `mapSupabaseError`.
- `presentation/hooks/*` — `useGetAllCustomers` (query), `useCreateCustomer` (mutation), etc.

### Código compartido transversal
`src/shared/` contiene lo que es transversal a todas las features:
- `shared/domain/pagination.ts` — `PaginatedResult<T>` genérico.
- `shared/infrastructure/supabase/supabaseClient.ts` — **el único cliente de Supabase**. Solo los repositorios lo importan.
- `shared/infrastructure/supabase/mapSupabaseError.ts` — traduce errores crudos de Postgres/Supabase a **claves i18n**. Para agregar un error nuevo, sumá una línea al mapa `ERROR_KEYS`. La UI solo hace `t(error.message)`.
- `shared/infrastructure/query/queryClient.ts` — el `QueryClient` global de TanStack.
- `shared/infrastructure/supabase/database.types.ts` — tipos generados de Supabase.

### Tipos generados de Supabase (`database.types.ts`)
- Es un archivo **generado**, no lo edites a mano. Refleja el esquema real de la BD (tablas, columnas, `Row`/`Insert`/`Update`) y tipa el cliente vía `createClient<Database>`.
- ⚠️ **Gotcha crítico**: cada vez que cambiás el esquema en Supabase (`ALTER TABLE`, nueva tabla o columna) tenés que **regenerar este archivo**. Si no lo hacés, `tsc` falla con `TS2339: Property '<col>' does not exist` porque los tipos quedaron con una foto vieja del esquema. Flujo correcto: **cambiar esquema → regenerar tipos → compilar**.
- No hay Supabase CLI local en el repo. La regeneración se hace vía el MCP de Supabase (`generate_typescript_types`) o `supabase gen types` si se configura la CLI.

### Acceso a datos en los repositorios (patrones)
- **RLS filtra por usuario, el repo NO.** Las tablas (`company`, `customers`, `invoices`) tienen Row Level Security con políticas del tipo `auth.uid() = user_id`. Por eso los repositorios hacen el `select` pelado y **no** filtran manualmente por `user_id`: Supabase ya devuelve solo las filas del usuario logueado. No dupliques ese filtro en el repo.
- **`.maybeSingle()` vs `.single()`**: usá `.maybeSingle()` cuando el registro **puede no existir** (devuelve `null` sin lanzar) — ej. `company` de una cuenta recién registrada. Usá `.single()` solo cuando exigís exactamente una fila (lanza error con 0 o con >1). Elegir mal acá rompe el caso "cuenta nueva".

---

## 5. Separación features/ vs views/ (IMPORTANTE)

Ésta es la estructura DELIBERADA del proyecto, no un estado transitorio. `features/` y `views/` son dos capas con responsabilidades distintas que coexisten por diseño:

- **`src/features/`** — la lógica de negocio (hexagonal, descripto en §4): dominio, casos de uso, acceso a datos y hooks.
- **`src/views/`** — la capa de presentación: pantallas de ruta y sus componentes de armado, que consumen los hooks de las features.

No hay que "migrar" `views/` hacia `features/`: cada una tiene su lugar. Lo único que NO debe pasar es que `views/` contenga acceso a datos (ver la regla de datos abajo).

**Qué vive en `views/` (composición de pantallas)**: `src/views/<feature>/` contiene la pantalla de ruta **y todos los componentes de armado propios de ESA página** — modales, secciones, cards y demás piezas presentacionales que solo usa esa vista. Es co-location: lo que pertenece a una página vive junto a la página. Ejemplo real: `views/customers/` agrupa `Customers.tsx` (pantalla) + `CustomerModal.tsx` + `CardsSectionGraphs.tsx` (sus componentes de armado).

**Límite views/ vs components/shared/**: un componente sube a `components/shared/` **solo cuando lo consumen 2+ pantallas distintas** (ej. `DataTable`, `Loader`, `SweetAlert`). Mientras sea específico de una sola página, se queda en `views/<feature>/`. No promuevas a `shared/` "por las dudas": la reutilización real es el disparador.

**Regla de datos (inquebrantable)**: `views/` es SOLO presentación. Nunca pongas acceso a datos ni lógica de Supabase en `views/` — los datos vienen exclusivamente de `features/*/presentation/hooks`. Si encontrás una vista que llama a Supabase o a un caso de uso directamente, mové ese acceso a datos al corte de feature correspondiente: la vista solo consume el hook.

---

## 6. Mapa de directorios

```
src/
├── features/        # ✅ lógica de negocio canónica (hexagonal por feature)
├── shared/          # domain + infrastructure transversal (cliente supabase, query client, errores, paginación)
├── views/           # pantallas de ruta (presentacionales; consumen hooks de features)
├── components/
│   ├── ui/          # primitivos shadcn/Radix — generados, evitá editarlos a mano
│   ├── shared/      # componentes reutilizables de app (DataTable, Loader, SweetAlert, ...)
│   └── layouts/     # MainLayout, AuthLayout, sidebar, navbar
├── router/          # Router.tsx, paths.ts, types.ts, guards/ (ProtectedRoute, PublicOnlyRoute)
├── hooks/           # hooks genéricos de UI (useDebounce, use-mobile)
├── i18n/            # config de i18next + locales/{es,en}.json
└── lib/             # utils.ts (helper cn, etc.)
```

---

## 7. Convenciones

### Imports y paths
- Usá siempre el alias `@/` para `src/` (`@/features/...`, `@/shared/...`). Configurado tanto en `tsconfig.app.json` como en `vite.config.ts`. Preferí el `@/` absoluto sobre paths relativos profundos.
- `verbatimModuleSyntax` está activo → **los imports de solo tipos deben usar `import type { ... }`**. Mezclar mal imports de valor y de tipo rompe el build.

### TypeScript
- `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `erasableSyntaxOnly` están todos activos. El código muerto y los parámetros sin usar rompen el build — limpialos.
- Preferí `interface` para formas de objetos/entidades (coincide con el código existente).

### Routing
- Todos los paths están centralizados en `src/router/paths.ts` (`PATHS`, `SEGMENTS`). Nunca hardcodees una ruta en un componente — importala desde `PATHS`.
- Las rutas protegidas pasan por `router/guards/ProtectedRoute`; las públicas (login, etc.) por `PublicOnlyRoute`.

### Formularios y validación
- Los formularios usan react-hook-form con un schema de zod vía `@hookform/resolvers`. El schema de zod es la única fuente de verdad de la validación. No dupliques lógica de validación a mano.

### Fetching de datos / mutaciones
- Nunca llames a Supabase ni a un caso de uso desde un componente. Siempre pasá por un `presentation/hook`.
- Las query keys son arrays estructurados que incluyen sus params, ej. `["customers", { search, page, pageSize }]`, para que la invalidación de caché y la paginación funcionen. Seguí esta forma.
- Usá `keepPreviousData` / `placeholderData` para listas paginadas (ver `useGetAllCustomers`).

### i18n (validado por TIPOS, sin strings de usuario hardcodeados)
- Todo texto visible para el usuario pasa por claves i18next en `src/i18n/locales/{es,en}.json`. Agregá la clave en AMBOS locales.
- **La validación de claves es por tipos, no por un linter.** `src/i18n/i18next.d.ts` augmenta i18next con `strictKeyChecks: true` y toma `en.json` como **fuente canónica de claves**. Consecuencia: `t("clave.inexistente")` **falla en `tsc`** (compile-time), y el tipo `ParseKeys` representa las claves válidas (por eso `mapSupabaseError` usa `Record<string, ParseKeys>`). No hace falta `eslint-plugin-i18next`.
- **Gotchas del flujo**: (1) toda clave nueva DEBE existir en `en.json` o `t()` no la reconoce y `tsc` falla. (2) Falta en `es.json` NO rompe el build, pero deja esa cadena en inglés — agregá siempre la clave en ambos locales. (3) `en.json` es el canon: si agregás una clave solo en `es.json`, el tipo no la ve.
- Los errores lanzados desde infrastructure llevan una **clave i18n como su message** (vía `mapSupabaseError`). La UI renderiza `t(error.message)`. Cuando agregues un modo de fallo nuevo, registrá su clave en `mapSupabaseError.ts` y en los archivos de locale.

### Estilos y UI
- Clases utilitarias de Tailwind CSS 4 + variables CSS. Componé clases con el helper `cn()` en `@/lib/utils`.
- Usá los primitivos shadcn existentes en `components/ui/` antes de construir UI nueva. Tratá `components/ui/*` como generados: preferí componer antes que editarlos.
- Íconos de lucide-react.

---

## 8. Entorno

Variables de entorno requeridas (Vite, con prefijo `VITE_`, leídas vía `import.meta.env`):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Ubicalas en `.env.local`. El cliente de Supabase lanza un error al arrancar si falta alguna. Nunca commitees secretos. Nunca hardcodees claves en el código.

---

## 9. Reglas de trabajo para agentes

1. **Seguí el layering hexagonal.** Al agregar una feature: creá entidad de `domain` + interfaz de repositorio → caso de uso en `application` → repo de Supabase en `infrastructure` (+ singleton) → hook en `presentation` → conectalo a una `view`. Modelalo sobre `features/customers/`.
2. **Respetá la dirección de dependencias.** Nunca importes Supabase, React ni TanStack dentro de `domain/` o `application/`.
3. **Un solo cliente de Supabase, en un solo lugar.** Solo los repositorios de infrastructure importan `supabaseClient`. La traducción de nombres de columna del backend vive en el repositorio, no en la UI ni en los casos de uso.
4. **Exponé los errores como claves i18n** a través de `mapSupabaseError`; nunca filtres códigos crudos de Postgres a la UI.
5. **Nada de archivos de datos mock.** No crees fixtures `*.data.ts`. Los datos vienen del backend vía hooks de feature.
6. **Type-safe por construcción.** Usá `import type` para tipos, mantené el código libre de locals/params sin usar y hacé que `yarn build` pase.
7. **Verificá en dos niveles:** mientras iterás usá `yarn tsc -b` + `yarn lint` (rápido, solo tipos + lint). Antes de dar algo por "terminado" corré `yarn build` (sello final: tipos + bundle de producción). Reportá los resultados.
8. **No cambies el toolchain** (gestor de paquetes, agregar formateadores/frameworks de test, reestructurar config) salvo que te lo pidan explícitamente.
9. **Respetá el idioma de comentarios existente** en cada archivo (actualmente español), pero mantené identificadores, copy de UI y documentación pública nueva en inglés.
10. **Mantené los cambios mínimos y consistentes** con los patrones de arriba. Preferí editar archivos existentes antes que crear nuevos.
