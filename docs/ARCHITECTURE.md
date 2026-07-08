# Clean Architecture — Guía del proyecto

Guía para entender cómo está organizado el código y cómo agregar features nuevos
replicando siempre el mismo patrón. Está escrita para leerse de arriba a abajo la
primera vez, y para usarse como recetario después.

## Índice

1. [La idea en una frase](#1-la-idea-en-una-frase)
2. [Las 2 analogías que hacen clic](#2-las-2-analogías-que-hacen-clic)
3. [Las 4 capas](#3-las-4-capas)
4. [Estructura de carpetas](#4-estructura-de-carpetas)
5. [Flujo completo del login (paso a paso)](#5-flujo-completo-del-login-paso-a-paso)
6. [Migrar de Supabase a tu backend propio](#6-migrar-de-supabase-a-tu-backend-propio)
7. [RECETA: agregar un feature nuevo (customers en profundidad)](#7-receta-agregar-un-feature-nuevo-customers-en-profundidad)
8. [`useQuery` vs `useMutation`](#8-usequery-vs-usemutation)
9. [Reglas de oro y errores comunes](#9-reglas-de-oro-y-errores-comunes)
10. [Checklist para cada feature nuevo](#10-checklist-para-cada-feature-nuevo)

---

## 1. La idea en una frase

> **La lógica de tu app NO debe saber de dónde vienen los datos.**

Hoy los datos vienen de Supabase. Mañana vendrán de tu backend propio. Ese cambio
debe tocar **un solo archivo por feature**, no toda la app.

---

## 2. Las 2 analogías que hacen clic

### Analogía A — El enchufe de la pared

- Tu UI (React) es como una **tele**.
- El **contrato** (interface del repositorio) es el **enchufe de la pared**.
- Supabase / tu backend es la **central eléctrica**.

La tele solo conoce el enchufe. No le importa si la electricidad viene de una
represa o de paneles solares. Cambiás la central eléctrica sin que la tele se
entere, porque el enchufe (el contrato) sigue igual.

### Analogía B — El restaurante (para seguir el flujo)

Cuando pedís una milanesa NO entrás a la cocina ni sabés cómo se cocina. Cada
persona hace UNA cosa y le pasa la pelota a la siguiente:

| Restaurante | Tu código | Archivo (ejemplo auth) |
|---|---|---|
| Vos (cliente) | El componente React | `Login.tsx` |
| El mozo | El hook | `useLogin.ts` |
| El pedido escrito | El caso de uso | `loginUseCase.ts` |
| El menú / la receta pedida (contrato) | La interface | `AuthRepository.ts` |
| El cocinero | La implementación | `SupabaseAuthRepository.ts` |
| El plato terminado | La entidad | `User.ts` |

La clave: pedís "milanesa" y no te importa si la hacen a la parrilla o al horno.
Si cambian la cocina entera, vos SEGUÍS pidiendo "milanesa" igual.

---

## 3. Las 4 capas

Organizamos por **feature** (Screaming Architecture). Cada feature tiene sus
propias capas. La dependencia SIEMPRE apunta hacia adentro (hacia el domain):

```
presentation  →  application  →  domain  ←  infrastructure
   (React)       (casos de uso)  (contratos)   (Supabase)
```

| Capa | Responsabilidad | ¿Conoce React? | ¿Conoce Supabase? |
|------|-----------------|:--------------:|:-----------------:|
| **domain** | Entidades + contratos (interfaces). El "QUÉ". Puro. | ❌ | ❌ |
| **application** | Casos de uso (acciones del negocio). | ❌ | ❌ |
| **infrastructure** | Implementa los contratos usando Supabase. El "CÓMO". | ❌ | ✅ |
| **presentation** | Hooks + componentes React. Conecta todo. | ✅ | ❌ |

**Regla de oro:** `domain` no importa NADA externo. Todo depende de `domain`,
`domain` no depende de nadie. Es el núcleo intocable; React y Supabase son
"detalles" reemplazables que orbitan alrededor.

---

## 4. Estructura de carpetas

```
src/
├── shared/                          # Transversal a todos los features
│   └── infrastructure/
│       ├── supabase/supabaseClient.ts   # ⚠️ ÚNICO lugar que crea el cliente Supabase
│       └── query/queryClient.ts         # Config de TanStack Query
│
└── features/
    └── auth/                        # ← EJEMPLO DE REFERENCIA (copiar este molde)
        ├── domain/
        │   ├── entities/User.ts             # Qué ES un usuario en tu negocio
        │   └── repositories/AuthRepository.ts  # El CONTRATO (interface)
        ├── application/
        │   └── useCases/loginUseCase.ts     # La acción "iniciar sesión"
        ├── infrastructure/
        │   └── SupabaseAuthRepository.ts    # Implementa el contrato con Supabase
        └── presentation/
            └── hooks/useLogin.ts            # Conecta React + caso de uso + TanStack
```

---

## 5. Flujo completo del login (paso a paso)

El viaje de un login, siguiendo la analogía del restaurante. Las flechas hacia
abajo son "te paso la pelota"; las de vuelta traen el `User`.

```
   Login.tsx  ──login.mutate(datos)──►  useLogin.ts
   (cliente)                             (mozo)
       ▲                                     │
       │                                     │ loginUseCase(repo, datos)
       │                                     ▼
       │                              loginUseCase.ts
       │ ◄── User ────┐               (pedido escrito)
       │              │                     │
       │              │                     │ authRepository.login(datos)
       │              │                     ▼
       │              │              AuthRepository ◄── el CONTRATO (enchufe)
       │              │                     │           implements
       │              │                     ▼
       │              └──── User ──── SupabaseAuthRepository.ts
       │                             (cocinero) ──► Supabase real
```

### Paso 1 — `Login.tsx` (el cliente)

El usuario aprieta el botón. El componente solo conoce al "mozo":

```tsx
const login = useLogin();

const onSubmit = (formData) => {
  login.mutate(formData, {
    onSuccess: () => navigate(PATHS.dashboard),
  });
};
```

No importa Supabase, no importa el caso de uso. Solo `useLogin`.

### Paso 2 — `useLogin.ts` (el mozo)

```ts
const authRepository = new SupabaseAuthRepository();  // elige QUÉ cocina se usa

export const useLogin = () =>
  useMutation({
    mutationFn: (credentials) => loginUseCase(authRepository, credentials),
  });
```

- `useMutation` te regala `isPending`, `isError`, `error` (como el sistema de
  comandas que avisa "en preparación / listo / falló").
- `new SupabaseAuthRepository()` es **la línea que decide la cocina**. El mozo la
  elige y se la pasa al pedido; al pedido no le importa cuál es.

### Paso 3 — `loginUseCase.ts` (el pedido escrito) — EL CORAZÓN

```ts
export const loginUseCase = async (
  authRepository: AuthRepository,   // ⬅️ recibe el CONTRATO, no Supabase
  credentials: LoginCredentials
): Promise<User> => {
  return authRepository.login(credentials);
};
```

El tipo dice `AuthRepository` (la interface), **no** `SupabaseAuthRepository`.
El caso de uso pide "algo que sepa hacer `.login()`" y no le importa QUIÉN lo
hace. Eso es **inyección de dependencias**: la dependencia entra por parámetro,
el caso de uso no la crea con `new`.

### Paso 4 — `AuthRepository.ts` (el contrato / el menú)

```ts
export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
```

Solo una promesa de "qué se puede hacer". Sin código, sin Supabase. Es el
**enchufe**: todo lo de arriba se enchufa acá, todo lo de abajo debe cumplirlo.

### Paso 5 — `SupabaseAuthRepository.ts` (el cocinero)

```ts
export class SupabaseAuthRepository implements AuthRepository {
  async login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) throw new Error(...);

    return {                          // ⬅️ TRADUCE Supabase → tu User
      id: data.user.id,
      email: data.user.email ?? "",
    };
  }
}
```

- `implements AuthRepository` obliga (por TypeScript) a tener todos los métodos
  del contrato. Si falta uno, no compila.
- La **traducción**: Supabase devuelve un objeto enorme; el cocinero lo convierte
  en tu `User` limpio. Así el resto de la app nunca ve la forma fea del backend.

### Paso 6 — `User.ts` (el plato terminado)

```ts
export interface User {
  id: string;
  email: string;
}
```

Tu forma de usuario, definida por TU negocio, no por Supabase. Es lo que viaja de
vuelta hasta el componente.

---

## 6. Migrar de Supabase a tu backend propio

Gracias a esta arquitectura, migrar es simple:

1. Creá `features/<feature>/infrastructure/HttpXxxRepository.ts` que implemente
   la MISMA interfaz (`implements AuthRepository`), pero usando `fetch`/axios.
2. En el hook de presentación, cambiá **una sola línea**:
   ```ts
   // antes
   const authRepository = new SupabaseAuthRepository();
   // después
   const authRepository = new HttpAuthRepository();
   ```
3. Listo. `domain`, `application` y los componentes NO se tocan.

Sin esta arquitectura tendrías que abrir CADA componente que hable con el backend
y reescribirlo. Los archivos "de más" que escribís hoy son el seguro que hace que
la migración de mañana sea trivial.

---

## 7. RECETA: agregar un feature nuevo (customers en profundidad)

Ejemplo real: migrar la pantalla de **customers** de datos mock a Supabase.
Se construye SIEMPRE de adentro hacia afuera (primero los cimientos):

```
1. domain/entities      →  qué ES un customer
2. domain/repositories  →  el contrato (qué se puede hacer)
3. application/useCases  →  la acción de negocio
4. infrastructure        →  el cocinero (Supabase + traducción)
5. presentation/hooks    →  el mozo (useQuery/useMutation)
6. la view               →  el cliente (consume el hook)
```

### Paso 1 — Domain: la entidad `Customer`

`src/features/customers/domain/entities/Customer.ts`
```ts
export interface Customer {
  id: number;
  createdAt: string;        // 👈 camelCase (tu negocio), NO created_at (Supabase)
  name: string;
  email: string;
  phone: string | null;
  identification: string | null;
  address: string | null;
}
```

**Decisión de arquitecto:** Supabase devuelve `created_at` (snake_case). En tu
entidad usás `createdAt` (la convención de tu código). ¿Por qué? Porque la entidad
no debe oler a Supabase. Si mañana tu backend devuelve `creationDate`, solo
cambiás la traducción (paso 4), no toda la app. La entidad es TUYA.

### Paso 2 — Domain: el contrato `CustomerRepository`

`src/features/customers/domain/repositories/CustomerRepository.ts`
```ts
import type { Customer } from "../entities/Customer";

export interface CustomerRepository {
  getAll(): Promise<Customer[]>;
  // Más adelante: create(), update(), delete() — se agregan acá cuando hagan falta.
}
```

Empezá SIMPLE: solo `getAll()`. No importa nada de Supabase ni React. Es puro.

### Paso 3 — Application: el caso de uso `getCustomersUseCase`

`src/features/customers/application/useCases/getCustomersUseCase.ts`
```ts
import type { Customer } from "../../domain/entities/Customer";
import type { CustomerRepository } from "../../domain/repositories/CustomerRepository";

export const getCustomersUseCase = (
  repository: CustomerRepository    // 👈 recibe el CONTRATO, no Supabase
): Promise<Customer[]> => {
  return repository.getAll();
};
```

Mismo patrón que `loginUseCase`: recibe el contrato por parámetro. Hoy solo
delega, pero acá irían reglas como "ordenar por nombre" o "filtrar inactivos".

### Paso 4 — Infrastructure: `SupabaseCustomerRepository` (el cocinero)

`src/features/customers/infrastructure/SupabaseCustomerRepository.ts`
```ts
import { supabase } from "@/shared/infrastructure/supabase/supabaseClient";
import type { Customer } from "../domain/entities/Customer";
import type { CustomerRepository } from "../domain/repositories/CustomerRepository";

export class SupabaseCustomerRepository implements CustomerRepository {
  async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from("customers")                          // nombre de tu tabla
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    // 👇 LA TRADUCCIÓN: forma de Supabase → tu entidad Customer
    return (data ?? []).map((row) => ({
      id: row.id,
      createdAt: row.created_at,     // created_at (Supabase) → createdAt (tu negocio)
      name: row.name,
      email: row.email,
      phone: row.phone,
      identification: row.identification,
      address: row.address,
    }));
  }
}
```

- `implements CustomerRepository` obliga a tener `getAll()`.
- El `.map` es el punto EXACTO donde aíslas la fealdad del backend. Es el único
  lugar donde existe `created_at`.

### Paso 5 — Presentation: el hook `useCustomers` (el mozo)

`src/features/customers/presentation/hooks/useCustomers.ts`
```ts
import { useQuery } from "@tanstack/react-query";
import { getCustomersUseCase } from "../../application/useCases/getCustomersUseCase";
import { SupabaseCustomerRepository } from "../../infrastructure/SupabaseCustomerRepository";

// 👉 la ÚNICA línea a cambiar el día de la migración
const repository = new SupabaseCustomerRepository();

export const useCustomers = () =>
  useQuery({
    queryKey: ["customers"],          // etiqueta del cache (siempre array)
    queryFn: () => getCustomersUseCase(repository),
  });
```

Ojo: listar es una LECTURA → `useQuery` (NO `useMutation`, eso era para login que
ESCRIBE). El `queryKey` es la etiqueta con la que TanStack cachea el resultado.

### Paso 6 — La view: conectar `Customers.tsx` (el cliente)

```tsx
// ❌ borrar:  import customers from "./customers.data";
// ✅ agregar:
import { useCustomers } from "@/features/customers/presentation/hooks/useCustomers";

const Customers = () => {
  const { data: customers, isLoading, isError } = useCustomers();

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar clientes</div>;

  return (
    <DataTable columns={columns} data={customers ?? []} /* ... */ />
  );
};
```

La view no sabe que existe Supabase. Solo conoce `useCustomers`. Si migrás el
backend, este archivo NO se toca.

---

## 8. `useQuery` vs `useMutation`

- **`useQuery`** → para LEER datos (listar clientes, traer un usuario). Se cachea.
- **`useMutation`** → para ESCRIBIR/cambiar (login, crear, editar, borrar).

Regla mental: si la operación **cambia** algo en el servidor → `useMutation`.
Si solo **lee** → `useQuery`. Esta es la ÚNICA decisión que varía entre features;
todo lo demás (las 4 capas) es idéntico.

---

## 9. Reglas de oro y errores comunes

**Reglas de oro**
- El `domain` no importa nada de React, Supabase ni librerías externas.
- Las dependencias apuntan hacia adentro: presentation → application → domain ←
  infrastructure.
- La view NUNCA importa Supabase. Solo consume hooks.
- La traducción backend → entidad vive SOLO en la capa infrastructure.
- Los nombres de campos de la entidad son los de TU negocio (camelCase), no los
  del backend.

**Errores comunes a evitar**
- ❌ Importar `supabase` dentro de un componente o de un caso de uso.
- ❌ Que el caso de uso haga `new SupabaseXxxRepository()` (rompe la inyección de
  dependencias). El repo entra por parámetro; el `new` vive solo en el hook.
- ❌ Que la entidad copie tal cual los nombres de Supabase (`created_at`).
- ❌ Usar `useMutation` para leer o `useQuery` para escribir.

---

## 10. Checklist para cada feature nuevo

- [ ] `domain/entities/` — la entidad, con TUS nombres de campos (camelCase)
- [ ] `domain/repositories/` — la interface (contrato)
- [ ] `application/useCases/` — un archivo por acción del negocio
- [ ] `infrastructure/` — la clase que implementa el contrato con Supabase + traduce
- [ ] `presentation/hooks/` — el hook con `useQuery` (leer) o `useMutation` (escribir)
- [ ] La view solo usa el hook, NUNCA importa Supabase
