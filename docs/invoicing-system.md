# Sistema de facturación (categories · catalog · invoices)

Este documento explica QUÉ construimos, POR QUÉ lo construimos así, y las
decisiones de fondo que tomamos en el camino. Es la memoria del diseño: si en el
futuro dudás "¿por qué esto es una FK acá pero un texto allá?", la respuesta
está acá.

> Todo sigue el layering hexagonal por feature descripto en `AGENTS.md §4`, con
> `src/features/customers/` como implementación de referencia (gold standard).

---

## Panorama: tres features, no una

La facturación NO es una sola feature. Son **tres cortes verticales** que se
apoyan uno en otro:

| Feature | Qué es | Depende de |
|---------|--------|-----------|
| `categories` | Categorías propias de cada usuario (etiquetas para clasificar). | — |
| `catalog` | Productos y servicios reutilizables del usuario. | `categories` (FK) |
| `invoices` | Las facturas emitidas. | Copia datos de `catalog` y del cliente (snapshot) |

El orden de construcción fue deliberado: **de lo simple a lo complejo**
(`categories` → `catalog` → `invoices`). Se afianza el patrón hexagonal en la
entidad simple antes de meterse con la compleja.

---

## La decisión que gobierna todo: template VIVO vs documento MUERTO

Esta es la idea más importante del diseño. Si entendés esto, entendés el resto.

> **Una misma categoría se guarda de forma DISTINTA según dónde vive, porque el
> catálogo mira al presente y la factura mira al pasado.**

- **El catálogo es un template VIVO.** Debe reflejar el presente. Si renombrás
  la categoría "Indumentaria" a "Ropa", TODOS los productos del catálogo deben
  actualizarse. → El catálogo guarda `category_id` (**FK**).

- **La factura es un documento MUERTO.** Debe reflejar el pasado. Una factura
  emitida el mes pasado que decía "Indumentaria" NO puede cambiar a "Ropa" solo
  porque hoy renombraste la categoría — eso sería falsear un documento legal ya
  emitido. → La factura guarda el **nombre copiado** (`categoryName`, texto).

Esto se llama **snapshot pattern**: la factura congela los datos en el momento
de emisión. Aplica a la categoría, al cliente y a las líneas.

| Dónde vive | Qué guarda | Por qué |
|-----------|-----------|---------|
| `catalog.category_id` | FK a `categories` | Template vivo → refleja el presente, se actualiza al renombrar |
| `invoice.items[].categoryName` | Nombre copiado (texto) | Documento muerto → congela el pasado, nunca cambia |
| `invoice.client_*` | Datos del cliente copiados | Documento muerto → la factura conserva al cliente tal como estaba al emitir |

---

## Feature `categories`

### Qué resuelve
El **seguimiento** confiable. El usuario quería responder "¿cuánto facturé en
pintura este mes?". Para eso cada ítem necesita una etiqueta consistente.

### Por qué es una tabla (y no un enum)
Recorrimos el razonamiento y descartamos opciones:

1. **Texto libre** → descartado. "pintura" vs "Pintura" rompe el seguimiento.
2. **Enum fijo en código** → descartado. No cubre el caso real: un programador
   que usa la app necesita crear su propia categoría "servicios web", cosa que
   un enum cerrado (definido por el sistema) no permite.
3. **Tabla por usuario** → **elegido**. Cada usuario crea las suyas en runtime.

> **Regla destilada:** lista fija que controla el sistema → *enum*. Lista que
> llena el usuario y crece en runtime → *tabla*.

### Cómo se previenen los duplicados
Dos defensas, en capas distintas:

- **Base de datos:** `UNIQUE (user_id, name)` frena duplicados EXACTOS del mismo
  usuario. Es *por usuario* (compuesto): dos usuarios distintos SÍ pueden tener
  ambos "Pintura".
- **UX (combobox):** al cargar un producto, la categoría se elige de un combobox
  que muestra las existentes mientras el usuario escribe ("ah, ya existe
  Pintura"), en vez de un input libre. Esto minimiza los casi-duplicados
  ("Pintura" vs "pintura") que el UNIQUE no atrapa.

### Particularidades de la implementación
- `getAll()` devuelve `Category[]` **sin paginar** (a diferencia de customers):
  va a un combobox que filtra localmente y un usuario tiene pocas categorías.
  Ordena por `name` ascendente (alfabético es lo natural para un combobox).
- `create()` devuelve `Promise<Category>` (**no `void`**): en el flujo
  *create-on-the-fly*, al crear una categoría desde el combobox se necesita la
  entidad recién creada (con su `id`) para seleccionarla al instante sin recargar.
- Solo `getAll` + `create` por ahora (no `edit`/`delete`) — YAGNI. Se suman si se
  construye una pantalla de gestión.

---

## Feature `catalog`

### Qué resuelve
Productos y servicios reutilizables. El usuario los da de alta una vez y los
"trae" al facturar (autocompletan la línea).

### Por qué UNA entidad con `type`, y no dos features (products / services)
Un producto ("Zapatillas, calzado, $80") y un servicio ("Pintura por m²,
pintura, $10") tienen la **misma forma**: nombre + categoría + precio. Modelarlos
como dos features sería 95% código duplicado y doble mantenimiento.

> **Misma FORMA no implica misma COSA.** Unificamos la *estructura* (una tabla,
> un CRUD) pero conservamos el *significado* con el campo `type`
> (`'product' | 'service'`). El `type` habilita: (1) el filtro "¿qué querés
> facturar?", (2) el seguimiento segmentado producto vs servicio, (3) mostrar las
> categorías correctas según el tipo.

### La categoría es FK (con RESTRICT)
`category_id` apunta a `categories` con `ON DELETE RESTRICT`:
- **RESTRICT**: no se puede borrar una categoría que está en uso. El usuario
  primero debe reasignar/borrar esos productos. Protege la integridad.
- **NOT NULL**: todo ítem tiene categoría siempre (no existe "sin categoría"),
  lo que simplifica la UI.

### El JOIN: lo que la base GUARDA vs lo que el negocio NECESITA
La base guarda `category_id` (un número, eficiente). Pero la UI necesita mostrar
"Indumentaria", no `5`. El repositorio resuelve esa tensión con un **JOIN por
embedding** de Supabase:

```ts
supabase.from("catalog").select("*, categories(name)", { count: "exact" })
```

Un solo query (sin N+1). El repo desanida `categories.name` y expone la entidad
con AMBOS campos: `categoryId` (para editar) + `categoryName` (para mostrar).

> El repositorio es el **traductor** entre lo que la base guarda y lo que el
> negocio necesita.

### Asimetría write/read
En `create`/`edit`, el tipo hace `Omit<..., "categoryName">`: se **escribe**
`categoryId` (la FK que persiste), se **lee** `categoryName` (viene del JOIN).

---

## Feature `invoices`

Es la entidad compleja: junta todos los conceptos.

### Dos entidades de dominio
- `InvoiceItem` — la línea (snapshot): `description`, `categoryName`, `quantity`,
  `unitPrice`, `total`. Guarda `categoryName` **texto**, no FK (documento muerto).
- `Invoice` — cabecera con datos del cliente aplanados (snapshot) + `items:
  InvoiceItem[]` + estado + fechas.

### Por qué las líneas van en `jsonb` (y no en tabla `invoice_items`)
Lo analizamos explícitamente. jsonb gana para ESTE negocio porque las líneas:

- **Siempre se leen con la factura** (nunca sueltas) → un query, sin join.
- **Son un snapshot** que vive y muere con la factura → no hay riesgo de líneas
  huérfanas ni edición por separado.
- **Se insertan atómicamente** con la factura → un solo `insert`, sin necesidad
  de transacción para coordinar dos tablas.
- **No necesitan análisis por línea individual.** El negocio es de servicios
  ad-hoc ("Pintura de pared de 5 metros" no se repite idéntica). El análisis útil
  es por `categoryName`, que ya está en cada línea.

Una tabla `invoice_items` sería sobre-ingeniería (transacciones, joins,
orquestación de dos tablas en el repo) por una capacidad analítica que este
negocio no usa.

### El manejo del jsonb, aislado en el repositorio
La columna `items` se tipa como `Json` (opaco). El repositorio —único lugar
autorizado a conocer la forma cruda de Supabase— traduce en ambos sentidos:

- `mapItems(Json → InvoiceItem[])` al leer.
- `serializeItems(InvoiceItem[] → Json)` al escribir.

El cast (`as unknown as`) vive SOLO acá. El dominio nunca ve un `Json` opaco.

### Ciclo de vida: sin borrador
Estados: `'sent' | 'paid' | 'cancelled'`. La factura **nace emitida** (`sent`) —
este negocio no tiene borrador, así que no se modeló uno ("no diseñar para un
futuro imaginario").

```
sent ──────► paid
  │
  └────────► cancelled
```

- `updateStatus('paid')` setea `paid_at = now()`.
- `overdue` (vencida) **NO es un estado guardado**: se **calcula** con la función
  de dominio pura `isOverdue()` (`status === 'sent' && dueDate < hoy`). Guardarlo
  como columna obligaría a un cron diario — trampa clásica evitada.

### Operaciones con intención de negocio (no CRUD genérico)
El repositorio expone `getAll` / `create` / `updateStatus` / `delete`. No hay un
`edit` libre: una factura emitida es un documento, no se edita como un cliente.
`updateStatus` reemplaza al edit. Se dejó también `delete` físico para cargas
erróneas, además del flujo contable normal (`updateStatus('cancelled')`).

### Reglas de negocio puras en el dominio
`isOverdue(invoice, now)` vive en `domain/entities/Invoice.ts`, sin imports, sin
base, sin cron. Es lógica de negocio → tiene su hogar en el dominio.

---

## Flujo end-to-end: de la categoría a la factura emitida

Esta sección describe el recorrido completo de USO, desde cero hasta una factura
emitida. Los campos se **derivan de las entidades del dominio** ya construidas
(`Category`, `CatalogItem`, `Invoice`/`InvoiceItem`).

> **Estado:** la capa de datos/dominio existe y está verificada. La capa de
> presentación (`views/`, los formularios y el stepper) es **diseño previsto,
> aún NO implementado**. Se documenta acá para guiar esa construcción.

### Visión general del recorrido

```
1. Crear categoría        (opcional, o inline al crear el ítem)
        ↓
2. Crear producto/servicio en el catálogo   (opcional; se puede facturar sin catálogo)
        ↓
3. Emitir factura   →   Paso 1: Formulario  →  Paso 2: Preview  →  Paso 3: Emitir
```

Los pasos 1 y 2 son **opcionales**: podés emitir una factura escribiendo las
líneas a mano, sin catálogo ni categorías previas. El catálogo es un *atajo de
carga*, no un requisito.

---

### Paso 1 — Crear una categoría

**Cuándo:** cuando querés una etiqueta nueva para clasificar
productos/servicios (habilita el seguimiento por categoría).

**Dos caminos:**
- **Dedicado:** crear la categoría antes, por su cuenta.
- **Inline (recomendado):** al cargar un producto/servicio, el campo categoría es
  un combobox que muestra las existentes y permite crear una al vuelo si no
  matchea ninguna (*create-on-the-fly*). Este camino previene duplicados porque
  el usuario VE que "Pintura" ya existe antes de crear otra.

**Campos del formulario:**

| Campo | Tipo | Obligatorio | Notas |
|-------|------|:-----------:|-------|
| `name` | texto | Sí | Único por usuario (la base rechaza duplicados exactos vía `UNIQUE(user_id, name)`). |

**Hooks:** `useGetAllCategories()` (lista para el combobox) · `useCreateCategory()`
(crea y **devuelve** la categoría con su `id` para seleccionarla al instante).

---

### Paso 2 — Crear un producto o servicio en el catálogo

**Cuándo:** cuando el ítem se repite entre facturas y querés reutilizarlo (no
reescribirlo cada vez). Es opcional.

**Campos del formulario** (derivados de `CatalogItem`):

| Campo | Tipo | Obligatorio | Notas |
|-------|------|:-----------:|-------|
| `type` | select `'product' \| 'service'` | Sí | Define si es producto o servicio. Habilita el filtro y el seguimiento segmentado. |
| `name` | texto | Sí | Ej: "Pintura por m²", "Zapatillas Nike". |
| `category` | combobox | Sí | Elige una categoría existente o crea una inline (Paso 1). Se guarda como `category_id` (FK). |
| `price` | número | Sí | Precio por defecto. Al facturar es editable (el catálogo solo sugiere). |
| `description` | texto | No | Detalle opcional. |

**Hooks:** `useGetAllCatalog({ type })` (lista con filtro y paginación) ·
`useCreateCatalogItem()` · `useEditCatalogItem()` · `useDeleteCatalogItem()`.

**Recordá:** el catálogo es un *template vivo*. Si después editás el precio o la
categoría del ítem, cambia para futuras facturas — pero **nunca** para las ya
emitidas (esas congelaron su snapshot).

---

### Paso 3 — Emitir la factura (stepper de 3 pasos)

El flujo de emisión es un **stepper** de tres pasos. Diseño previsto:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ 1. Formulario│ ──► │ 2. Preview  │ ──► │ 3. Emitir   │
│  (cargar)    │     │ (revisar)   │     │ (confirmar) │
└─────────────┘     └─────────────┘     └─────────────┘
```

#### Paso 3.1 — Formulario

Aquí se arma la factura. Tiene tres bloques:

**A) Datos de la factura (cabecera)** — derivados de `Invoice`:

| Campo | Tipo | Obligatorio | Notas |
|-------|------|:-----------:|-------|
| `invoiceNumber` | texto | Sí | Número de factura. Único por usuario (`UNIQUE(user_id, invoice_number)`). |
| `issueDate` | fecha | Sí | Fecha legal de emisión. Por defecto hoy. |
| `dueDate` | fecha | Sí | Fecha de vencimiento (ej: emisión + 30 días). |
| `notes` | texto | No | Observaciones. |

> `status` NO es un campo del formulario: la factura nace `'sent'`. `paidAt`,
> `pdfUrl`, `createdAt` e `id` los define el sistema, no el emisor.

**B) Datos del cliente (snapshot)** — se copian dentro de la factura:

| Campo | Tipo | Obligatorio | Notas |
|-------|------|:-----------:|-------|
| `clientName` | texto | Sí | |
| `clientEmail` | texto | Sí | |
| `clientPhone` | texto | No | |
| `clientAddress` | texto | No | |

> Estos datos se **congelan** al emitir. Si el cliente cambia sus datos mañana,
> esta factura conserva los de hoy. (Si en el futuro existe una feature de
> clientes reutilizables, se podría "traer" un cliente que autocomplete estos
> campos — pero lo que se guarda siempre es la copia.)

**C) Líneas de la factura** — un array de `InvoiceItem`. Cada línea se puede
cargar de dos formas:

- **Traer del catálogo:** un select (filtrable por `type`: productos o
  servicios) muestra los ítems del catálogo. Al elegir uno, **autocompleta**
  `description`, `categoryName` y `unitPrice` — todos **editables** después.
- **Escribir a mano:** una línea libre sin pasar por el catálogo.

Campos de cada línea (`InvoiceItem`):

| Campo | Tipo | Obligatorio | Notas |
|-------|------|:-----------:|-------|
| `description` | texto | Sí | Ej: "Pintura de pared de 5 metros". |
| `categoryName` | texto (del combobox) | Sí | Se guarda el **nombre** (snapshot), no el id. |
| `quantity` | número | Sí | Cantidad. |
| `unitPrice` | número | Sí | Precio unitario. |
| `total` | número (calculado) | — | `quantity × unitPrice`. No se escribe: se calcula. |

**Totales:** `totalAmount` de la factura = suma de los `total` de cada línea. Se
calcula en vivo, no es un campo editable.

**Hooks del formulario:** `useGetAllCategories` + `useCreateCategory` (combobox
de categorías) · `useGetAllCatalog({ type })` (traer ítems).

#### Paso 3.2 — Preview

Muestra la factura ya armada tal como se verá (cabecera, cliente, tabla de líneas
con sus totales, total general). Es **solo lectura** — sirve para revisar antes de
comprometer el documento. Si algo está mal, se vuelve al Paso 1.

Este paso refuerza la naturaleza de *documento* de la factura: se revisa ANTES de
emitir, porque una vez emitida ya no se edita (solo cambia de estado).

#### Paso 3.3 — Emitir

Confirma y persiste. Recién acá se llama a `useCreateInvoice()` con el objeto
`Invoice` completo (sin `id`/`createdAt`/`paidAt`/`pdfUrl`, que los pone el
sistema). La factura queda en estado `'sent'`.

**Hook:** `useCreateInvoice()`.

---

### Después de emitir: ciclo de vida

Una vez emitida (`sent`), la factura ya no se edita. Solo cambia de estado:

- **Marcar pagada** → `useUpdateInvoiceStatus({ invoiceId, status: 'paid' })`
  (setea `paid_at`).
- **Cancelar** → `useUpdateInvoiceStatus({ invoiceId, status: 'cancelled' })`.
- **Vencida** → NO es una acción: se calcula sola con `isOverdue()`
  (`status === 'sent' && dueDate < hoy`).
- **Borrar** (carga errónea) → `useDeleteInvoice(invoiceId)`.

---

## Esquema de base de datos (Supabase)

Todas las tablas tienen **RLS activado** con políticas `auth.uid() = user_id`
(select/insert/update/delete). Por eso los repositorios hacen el `select` pelado
SIN filtrar `user_id` a mano: Supabase ya devuelve solo las filas del usuario.

### `categories`
```
id, created_at, user_id (DEFAULT auth.uid()), name
UNIQUE (user_id, name)
```

### `catalog`
```
id, created_at, user_id (DEFAULT auth.uid()),
type varchar CHECK (type IN ('product','service')),
name, category_id bigint NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
price numeric, description text NULL
```

### `invoices` (ajustada sobre la tabla existente)
```
+ status varchar CHECK (status IN ('sent','paid','cancelled')) DEFAULT 'sent'
+ issue_date date
+ due_date date
+ paid_at timestamptz NULL
~ invoice_number: se quitó el UNIQUE global → UNIQUE (user_id, invoice_number)
~ user_id: se agregó DEFAULT auth.uid()
items jsonb  ·  client_* (snapshot)  ·  total_amount numeric  ·  notes text NULL  ·  pdf_url text NULL
```

---

## Gotchas y lecciones (para no tropezar de nuevo)

| Gotcha | Qué pasó / cómo evitarlo |
|--------|--------------------------|
| **Orden sagrado: schema → tipos → compilar** | Al agregar `DEFAULT auth.uid()` a `invoices.user_id` sin regenerar `database.types.ts`, `tsc` falló con `TS2345: Property 'user_id' is missing`. Los tipos tenían una foto vieja del schema. SIEMPRE regenerar tipos tras un cambio de schema. |
| **`invoices.user_id` no tenía DEFAULT** | Las otras 3 tablas sí. Se agregó por `ALTER TABLE`. Sin eso, el repo tendría que mandar `user_id` a mano (metiendo lógica de auth donde no va). |
| **`database.types.ts` conserva `PostgrestVersion "14.5"`** | El generador propone `14.15`; se preserva la del archivo. Solo se agregan/actualizan los bloques de tabla, no la versión del cliente. |
| **Claves i18n validadas por tipos** | `errors.catalog.itemNotFound` / `errors.invoices.invoiceNotFound` DEBEN existir en `en.json` (canon) o `tsc` falla. Se agregaron en `en.json` y `es.json`. |
| **Errores de lint preexistentes** | El repo tiene ~10 errores de lint previos (DataTable, ui/*, use-mobile, views/auth/*, CompanyData — React Compiler). NO son de estas features. Al leer el linter, chequear los PATHS antes de asumir que el error es propio. |

---

## Mapa de archivos

```
src/features/categories/
├── domain/entities/Category.ts
├── domain/repositories/CategoryRepository.ts
├── application/useCases/{getAllCategories,createCategory}UseCase.ts
├── infrastructure/{SupabaseCategoryRepository,categoryRepositoryInstance}.ts
└── presentation/hooks/{useGetAllCategories,useCreateCategory}.ts

src/features/catalog/
├── domain/entities/CatalogItem.ts          # CatalogItem, CatalogItemType, GetCatalogParams
├── domain/repositories/CatalogRepository.ts
├── application/useCases/{getAllCatalog,createCatalogItem,editCatalogItem,deleteCatalogItem}UseCase.ts
├── infrastructure/{SupabaseCatalogRepository,catalogRepositoryInstance}.ts  # JOIN a categories
└── presentation/hooks/{useGetAllCatalog,useCreateCatalogItem,useEditCatalogItem,useDeleteCatalogItem}.ts

src/features/invoices/
├── domain/entities/Invoice.ts              # Invoice, InvoiceItem, InvoiceStatus, isOverdue()
├── domain/repositories/InvoiceRepository.ts
├── application/useCases/{getAllInvoices,createInvoice,updateInvoiceStatus,deleteInvoice}UseCase.ts
├── infrastructure/{SupabaseInvoiceRepository,invoiceRepositoryInstance}.ts  # jsonb items
└── presentation/hooks/{useGetAllInvoices,useCreateInvoice,useUpdateInvoiceStatus,useDeleteInvoice}.ts
```

---

## Lo que falta (próximos pasos)

La capa de negocio (dominio + datos) está COMPLETA. Falta la **capa de
presentación** (`src/views/`), que consume los hooks:

1. **Lista de facturas** — `DataTable` con filtro por `status` y acciones (marcar
   pagada / cancelar / borrar). Hoy `views/invoices/InvoiceTable.tsx` es un stub.
2. **Emisión con stepper de 3 pasos** (formulario → preview → emitir), detallado
   en la sección "Flujo end-to-end · Paso 3": combobox de categorías con creación
   inline (`useGetAllCategories` + `useCreateCategory`), "traer del catálogo"
   (`useGetAllCatalog` filtrando por `type`, que autocompleta una línea editable),
   snapshot del cliente, cálculo en vivo de `totalAmount`, y preview de solo
   lectura antes de confirmar la emisión.
3. **Rutas** — `SEGMENTS.invoices` ya existe en `router/paths.ts`; evaluar rutas
   hijas (`/new`, `/:id`).

Pendientes menores:
- Schema Zod para validar `InvoiceItem` (validación = fuente de verdad, por AGENTS.md).
- Clave i18n para el constraint `categories_user_name_unique` (código `23505`) en
  `mapSupabaseError`, para un mensaje de duplicado amigable en el combobox.
- Unificar la convención de invalidación de queries en los hooks (`categories`
  invalida dentro del hook; `customers`/`catalog`/`invoices` lo dejan al componente).
```
