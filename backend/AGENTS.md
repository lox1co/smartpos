# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Reglas del proyecto SmartPOS

Estas reglas son obligatorias para todo el proyecto (app móvil y backend).

## Stack de la app móvil

| Área                | Tecnología                        |
| ------------------- | --------------------------------- |
| Lenguaje            | TypeScript (strict)               |
| Framework           | React Native con Expo SDK 57      |
| Estado              | Zustand                           |
| Validación          | Zod                               |
| Base de datos local | Drizzle ORM (SQLite, expo-sqlite) |

### Documentación oficial (consultar antes de escribir código)

- Expo SDK 57: https://docs.expo.dev/versions/v57.0.0/
- Expo Router: https://docs.expo.dev/router/introduction/
- Expo SQLite: https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/
- React Native: https://reactnative.dev/docs/getting-started
- Zustand: https://zustand.docs.pmnd.rs/
- Zod: https://zod.dev/
- Drizzle ORM (Expo SQLite): https://orm.drizzle.team/docs/connect-expo-sqlite
- TypeScript: https://www.typescriptlang.org/docs/

## Tipado

- Prohibido `any` (explícito o implícito). Todo `any` existente debe eliminarse y tiparse correctamente.
- Prohibido `@ts-ignore` y `@ts-expect-error` sin justificación en el PR.
- Preferir `unknown` + validación con Zod en los límites (API, storage, params de rutas).
- Los tipos se infieren desde los esquemas: `type X = z.infer<typeof xSchema>`.
- Los tipos de tablas se infieren desde Drizzle: `$inferSelect` / `$inferInsert`.
- `strict: true` en `tsconfig.json`; el código debe pasar `tsc --noEmit` sin errores.

## Estilo de código

- **Sin comentarios** en el código (ni `//`, ni `/* */`, ni JSDoc). El código debe ser autoexplicativo con buenos nombres.
- **Máximo 400 líneas por archivo.** Si un archivo se acerca al límite, dividirlo inmediatamente en submódulos, hooks o componentes.
- Funciones pequeñas con una única responsabilidad.
- Solo componentes funcionales y hooks; nada de clases.
- Exports nombrados; `default` solo donde Expo Router lo exige (pantallas en `app/`).
- Sin código muerto, `console.log` ni imports sin usar.
- Nombres: `PascalCase` componentes/tipos, `camelCase` funciones/variables, `kebab-case` archivos no-componente, `PascalCase.tsx` componentes.

## Patrón de código

Cada archivo sigue este orden:

1. Imports (externos, luego alias internos `@/`, luego relativos).
2. Tipos / props.
3. Constantes.
4. Componente o función principal.
5. Exports.

## 3.2. Estructura de Directorios y Separación de Capas (Clean Architecture & Feature-Sliced Modular)

Esta es la única arquitectura autorizada para el proyecto:

```
app/                        Rutas (Expo Router). Solo composición, layouts y navegación (< 400 líneas). Sin lógica SQL ni llamadas HTTP directas.
components/
  ui/                       Componentes base reutilizables (< 400 líneas). Extraídos estrictamente de duplicaciones reales.
  <feature>/                Componentes visuales propios de una funcionalidad (< 400 líneas). Solo reciben props o hooks de dominio.
hooks/                      Hooks de presentación y adaptadores de dominio (< 400 líneas). Orquestan repositorios y stores.
db/
  client.ts                 Inicialización de expo-sqlite y drizzle-orm (WAL, Synchronous Normal) (< 400 líneas).
  schema/                   Tablas Drizzle y relaciones formalizadas (< 400 líneas por archivo).
  migrations/               Migraciones versionadas generadas por drizzle-kit y aplicadas vía migrator en runtime.
  repositories/             Acceso a datos transaccional SQLite (< 400 líneas por repo).
services/                   Workers en segundo plano (sync outbox), red, autenticación y hardware (< 400 líneas).
stores/                     Stores Zustand para estado de UI y sesión (< 400 líneas).
schemas/                    Esquemas Zod para validación y tipos inferidos (< 400 líneas).
constants/                  Tokens de diseño, tema, configuración inmutable (< 400 líneas).
utils/                      Funciones puras libres de dependencias externas (money.ts) (< 400 líneas).
types/                      Tipos compartidos globales no inferibles (< 400 líneas).
```

## 3.3. Matriz de Dependencias Unidireccionales (Grafo Estricto de Imports)

Para garantizar desacoplamiento estricto y evitar ciclos de dependencias o fugas de responsabilidades, la jerarquía de imports permitida es unidireccional:

```
[ app/ (Rutas) ] 
       │
       ▼
[ components/ ] ──► [ hooks/ ]
       │                 │
       ▼                 ▼
[ stores/ ] ◄────── [ services/ ]
                         │
                         ▼
             [ db/repositories/ ]
                         │
                         ▼
             [ db/schema/ & db/client.ts ]
                         │
                         ▼
       [ schemas/ | utils/ | constants/ | types/ ]
```

### Reglas estrictas de importación por capa:

| Capa | Qué PUEDE importar | Qué TIENE PROHIBIDO importar |
| :--- | :--- | :--- |
| **`app/` (Pantallas)** | `components/`, `hooks/`, `stores/`, `constants/`, `types/` | `db/repositories/`, `db/client.ts`, llamadas HTTP directas (`fetch`/`axios`). |
| **`components/ui/` (Design System)** | React Native, `constants/` (tokens), `utils/` | `stores/`, `db/`, `hooks/` de negocio, `services/`. UI pura y agnóstica. Prohibido crear componentes especulativos sin uso real existente. |
| **`components/<feature>/`** | `components/ui/`, `hooks/`, `stores/`, `schemas/`, `constants/` | `db/repositories/`, `db/client.ts`, llamadas HTTP directas. |
| **`hooks/` (Presentación / Dominio)** | `stores/`, `db/repositories/`, `services/`, `schemas/`, `utils/`, `constants/` | `components/`, `app/`. |
| **`stores/` (Zustand UI State)** | `schemas/`, `utils/`, `constants/`, `types/` | `components/`, `app/`, `db/repositories/`, `db/client.ts`. |
| **`services/` (Sync / Red / Hardware)** | `db/repositories/`, `schemas/`, `utils/`, `constants/`, `types/` | `components/`, `app/`, UI stores. |
| **`db/repositories/` (Datos)** | `db/client.ts`, `db/schema/`, `utils/money.ts`, `types/` | `components/`, `hooks/`, `stores/`, `app/`. |
| **`db/schema/` y `db/client.ts`** | Drizzle ORM, `expo-sqlite` | Cualquier módulo fuera de `db/`. |
| **`schemas/`, `utils/`, `constants/`** | Zod, bibliotecas externas utilitarias | `db/`, `stores/`, `hooks/`, `components/`, `app/`. |

## Reglas Financieras y de Dominio POS (Decisiones de Arquitectura)

- **Precisión Monetaria Entera (Zero-Float Rule)**:
  - Todo importe monetario se almacena en SQLite y se opera en la lógica de negocio como **enteros en centavos** (`price_cents`, `cost_price_cents`, `subtotal_cents`, `tax_cents`, `discount_cents`, `total_cents`, `credit_balance_cents` de tipo `integer`).
  - Queda prohibido usar operaciones con floats directos (`Number` IEEE 754) para cálculos de dinero.
  - Las conversiones y formateos visuales se realizan exclusivamente mediante utilidades puras en `utils/money.ts` (`toCents`, `fromCents`, `formatCents`).
- **Resolución de Conflictos Offline e Inventario**:
  - Toda venta offline es autoritativa localmente con identificador único UUIDv4 (`client_id`).
  - Si una sincronización offline genera inventario menor a cero, se acepta la transacción en el servidor permitiendo saldo negativo temporal y emitiendo una notificación de *backorder* para auditoría, sin rechazar ni anular tickets ya entregados al cliente.

## Offline-first y Base de Datos Local

- Toda la app debe funcionar completamente sin conexión a internet.
- La fuente de verdad absoluta en la app móvil es la base de datos local SQLite con Drizzle ORM (`db/client.ts`). La UI lee siempre de local.
- Configuración de SQLite: Activar obligatoriamente `PRAGMA journal_mode = WAL;` y `PRAGMA synchronous = NORMAL;`.
- **Transacciones ACID**: Todo cobro/checkout debe ser atómico en una única transacción SQLite:
  1. Insertar venta en `transactions`.
  2. Insertar items en `transaction_items`.
  3. Decrementar inventario en `products`.
  4. Encolar mutación en `sync_outbox`.
- **Outbox Pattern**: Toda mutación generada localmente se almacena en `sync_outbox` con estados `pending | syncing | failed | synced`. Prohibido truncar transacciones con `slice()`.
- La sincronización en segundo plano es idempotente, con reintentos y backoff exponencial; los conflictos se resuelven de forma determinista con marcas temporales `updated_at`.
- Usar IDs generados en cliente (UUIDv4) para crear registros sin red.
- Nunca bloquear la UI esperando red; mostrar estado de sincronización en tiempo real.
- Migraciones con `drizzle-kit` versionadas y aplicadas de forma segura al arrancar la app.
- Prohibido el uso de la clase singleton `ProductStore` (`constants/store.ts`) para nuevos desarrollos.

## Componentes reutilizables

- **Prohibido crear componentes por si acaso o para un futuro hipotético**.
- Todo componente en `components/ui/` debe nacer estrictamente a partir de la extracción de código duplicado cuando se reutilice efectivamente en 2 o más lugares.
- Antes de crear un componente, buscar si ya existe uno reutilizable en `components/ui/`.
- Un componente = un archivo = una responsabilidad; props tipadas explícitamente.
- Estilos y tokens centralizados en `constants/`; sin valores mágicos en línea.

## Calidad

- Antes de terminar una tarea: `tsc --noEmit` y ESLint sin errores.
- Al editar un archivo existente, eliminar sus comentarios y cualquier `any`, y respetar el límite de 400 líneas.

## Agentes y subagentes

- Todo agente o subagente creado en este proyecto debe leer y cumplir este archivo al pie de la letra, sin que el usuario deba recordarlo.
- Al definir un subagente, su system prompt debe empezar con: "Lee y cumple estrictamente d:\dev\smartpos\AGENTS.md antes de cualquier acción; sus reglas tienen prioridad absoluta."
- Al invocar un subagente, el prompt debe repetir que AGENTS.md es obligatorio.
- Ningún agente puede omitir estas reglas por brevedad o urgencia; ante conflicto, prevalece AGENTS.md.
- El agente que recibe el trabajo de un subagente debe verificar que cumple las reglas (sin comentarios, sin any, máx. 400 líneas, offline-first, grafo de dependencias respetado) antes de darlo por terminado.
