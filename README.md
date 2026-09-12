# Modularised React Template

React 19 + Vite + TypeScript template built on a strict app/module split.

**▶ Live preview: https://modularised-react-template.vercel.app/**

The preview site is itself built with this template — every page you see is a
module, and the live demo calls a real API through the services layer. Built by
[Wilson Wong](https://github.com/wilws) ·
[source](https://github.com/wilws/modularised_react_template).

## The rule

```
src/
├── app/                  core — owns the shell, the router, and cross-cutting providers
│   ├── components/
│   │   ├── Basic/        ← every UI primitive (Button, Title, Text...) comes from here
│   │   └── ...           shared chrome (Header, Footer, MainLayout, LanguageSwitcher, ErrorPage)
│   ├── locales/          translation engine + app-level strings
│   ├── providers/        cross-cutting context (language)
│   └── router/           ← the ONLY place modules connect to the app
├── services/             ← ALL backend & external communication
│   └── api/              one folder per resource, each with its own schemas
└── modules/              one folder per page
    ├── home/
    │   ├── router/       ← the module's ONLY public surface
    │   ├── views/        page-level components
    │   ├── components/   components private to this module
    │   └── locales/      strings private to this module
    ├── appDocs/          the /app docs page
    ├── modulesDocs/      the /modules docs page
    ├── servicesDocs/     the /services docs page
    └── dogDemo/          live API demo
```

1. **A module owns its views, components, locales and styles.**
2. **A module exposes routes only.** `src/modules/<name>/router/index.tsx` exports a `RouteObject[]`. Nothing else is imported from outside the module.
3. **Modules never import each other.** To move between pages, navigate by path.
4. `src/app/router/index.tsx` is the single seam — the only file in `app/` that imports from `modules/`.
5. **All UI primitives come from `src/app/components/Basic`.** See below.
6. **All external communication lives in `src/services`.** App and modules render; they never fetch. See below.

## Adding a page

```bash
mkdir -p src/modules/about/{router,views/About,locales}
```

```tsx
// src/modules/about/router/index.tsx
import type { RouteObject } from "react-router-dom";
import { About } from "../views";

export const aboutRoutes: RouteObject[] = [
  { path: "about", element: <About /> },
];
```

Then register it — the only app-side change:

```tsx
// src/app/router/index.tsx
import { aboutRoutes } from "../../modules/about/router";

const moduleRoutes: RouteObject[] = [...homeRoutes, ...aboutRoutes];
```

Add `nav.about` to the nav list in `src/app/components/Header/index.tsx` if it needs a link.

## Basic components

`src/app/components/Basic` is the single source of every UI primitive — buttons,
headings, text, inputs, layout. It re-exports the UI library (Mantine) so the
rest of the app never touches it directly.

**Two hard rules:**

1. **No file outside `Basic/` imports a UI library directly.** No `from "@mantine/core"` anywhere else.
2. **No file outside `Basic/` writes a raw `<button>`, `<h1>`, `<p>`, `<a>`, `<input>`, `<ul>` …** Use the primitive instead.

This applies to app components *and* modules alike:

```tsx
// ✅ app shell
import { Button, Title, Text } from "../Basic";

// ✅ inside a module
import { Button, Stack } from "../../../../app/components/Basic";

// ❌ never
import { Button } from "@mantine/core";
<button onClick={...}>Save</button>
<h1>Title</h1>
```

### Why

Every primitive funnels through one file, so you can restyle, wrap, patch or
swap the entire UI library by editing `Basic/index.tsx` — not by touching
hundreds of call sites.

### The primitive for each HTML tag

| Instead of | Use |
|---|---|
| `<button>` | `Button`, `ActionIcon`, `UnstyledButton` |
| `<h1>`–`<h6>` | `Title` with `order={1..6}` |
| `<p>`, `<span>` | `Text` |
| `<a>` | `Anchor` (routing: `component={Link}`) |
| `<div>` | `Box`, `Stack`, `Group`, `Paper` |
| `<ul>`, `<ol>` | `List` + `List.Item` |
| `<input>`, `<select>` | `TextInput`, `Select`, `Checkbox` … |

The full component list is in the comment at the bottom of
[`Basic/index.tsx`](src/app/components/Basic/index.tsx).

### Overriding a primitive

Write your own and re-export it *after* the wildcard so it wins:

```tsx
// src/app/components/Basic/index.tsx
export * from "@mantine/core";                 // everything
export { MyButton as Button } from "./Button"; // …except Button
```

Nothing else changes — every existing `import { Button } from ".../Basic"`
now resolves to your version.

### Checking compliance

```bash
# raw HTML primitives outside Basic
grep -rnE "<(button|h1|h2|h3|p|a|input|select|ul|li)[ >/]" src --include="*.tsx" | grep -v "components/Basic"

# direct library imports outside Basic
grep -rn 'from "@mantine' src --include="*.tsx" --include="*.ts" | grep -v "components/Basic"
```

Both should return nothing.

## Services

`src/services` owns every conversation with the outside world. **App and
modules render — they never fetch, never validate.**

```
services/api/
├── user/                 one folder per resource
│   ├── index.ts            the fetch calls  ← the resource's entry point
│   ├── schema.ts           request + response zod schemas
│   └── types.ts            types inferred FROM the schemas
└── index.ts              groups resources into `api`
```

No shared client, no wrapper. Each resource is a plain file of `async`
functions calling `fetch`, so a third-party endpoint just uses its own URL and
its own headers — and one needing no token simply doesn't send one.

### Calling a service

```tsx
import { api } from "../../../../services/api";

useEffect(() => {
  api.users.listUsers().then(setUsers).catch(console.error);
}, []);
```

```ts
api.users.viewProfile({ userId })
api.users.updateProfile({ userId, givenName: "Ada" })
```

### Validation lives here, not in components

Every call validates the payload before sending and the response before
returning:

```ts
export const viewProfile = async (payload: { userId: string }) => {
  const { userId } = UserSchemas.viewProfile.parse(payload);   // 1. request

  const response = await fetch(`${BASE_URL}/v1/users/${userId}`);
  if (!response.ok) throw new Error(`Failed to load profile (${response.status})`);

  return UserResponseSchemas.profile.parse(await response.json());  // 2. response
};
```

So a resolved promise is a **guarantee**: the data matched the schema. A view
renders `profile.email` with no null check, no cast, no defensive `?.`.

Types are inferred, never hand-written — change a schema and every call site
that no longer fits fails to compile:

```ts
export type IProfile = z.infer<typeof UserResponseSchemas.profile>;
```

### Adding a resource

```
src/services/api/order/
├── index.ts     the fetch calls
├── schema.ts    OrderSchemas + OrderResponseSchemas
└── types.ts     z.infer from those schemas
```

Then two lines in `src/services/api/index.ts`:

```ts
import * as orders from "./order";

export const api = {
  users,
  orders,     // ← now api.orders.xxx()
};
```

A third-party resource is the same, with its own base URL and headers — see
`src/services/api/dog/`, which calls the public [Dog API](https://dog.ceo/dog-api/breeds-list)
with no auth at all. The `/demo` page runs it live and shows every file involved.

### Checking compliance

```bash
# fetch outside services
grep -rn "fetch(" src --include="*.tsx" | grep -v "src/services"

# a component defining or parsing a schema
grep -rnE 'z\.(object|array|string|number)\(|\.parse\(' src --include="*.tsx" \
  | grep -v "src/services"
```

Both should return nothing.

Components may `import { z } from "zod"` for one purpose only — narrowing a
caught error with `err instanceof z.ZodError`, so a schema mismatch can be told
apart from a network failure. Defining schemas and calling `.parse()` stay in
`services/`.

## Languages

Eight languages ship, each with a flag in the switcher:

| | | | |
|---|---|---|---|
| 🇬🇧 `EN` English | 🇯🇵 `JP` 日本語 | 🇭🇰 `ZH` 繁體中文 | 🇨🇳 `CN` 简体中文 |
| 🇰🇷 `KR` 한국어 | 🇩🇪 `DE` Deutsch | 🇫🇷 `FR` Français | 🇵🇱 `PL` Polski |

The active language is stored in `LangProvider`, persisted to `localStorage`, detected from the browser on first visit, and mirrored onto `<html lang>`.

**App-level strings** live in `src/app/locales/app.ts`:

```tsx
const { t } = useTranslation();
t("nav.home");
```

**Module strings** live in the module and never register with the app:

```tsx
const { t } = useModuleTranslation(homeLocale);
t("dog.count", { count: 108 });   // "{count}" slots interpolate
```

`defineLocale` makes every language required — a missing translation is a **compile error**, not a runtime fallback. Message ids are inferred from the `EN` entry, so `t()` autocompletes.

Locale-aware number and date formatting:

```tsx
const { formatNumber, formatDate } = useFormatters();
```

### Adding a language

1. Add the key to `langKeyList`, `langLocaleMap` and `langFlagMap` in `src/app/providers/lang/types.ts`.
2. TypeScript will now error on every locale bundle until the new language is filled in.

That second step is the point: a missing translation cannot ship silently.

## Commands

```bash
npm install
npm run dev      # dev server
npm run build    # typecheck + production build
npm run lint     # eslint
npm run test     # vitest (service tests)
npm run preview  # serve the production build
```

## Testing

Services are plain async functions, so they test without React and without a
running app. Each test sits beside the service it covers:

```
src/services/api/dog/
├── index.ts        the service
├── index.test.ts   ← its test
├── schema.ts
└── types.ts
```

Cover the happy path, the request that was sent, an invalid payload (which must
reject *before* `fetch` is called), a malformed response (which must throw a
`ZodError` rather than leak), a non-2xx status, and a network failure.

Because a service is just a function, the same test can run against the real
API by dropping the `fetch` stub — turning the suite into a contract check that
fails when the backend changes shape. See `/services/testing` in the app.

## Deploying

The app uses `createBrowserRouter`, so the host must rewrite every path to
`index.html` — otherwise `/app` and other deep links 404 on a hard refresh.

[`vercel.json`](vercel.json) does this for Vercel:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Netlify equivalent, in `public/_redirects`:

```
/*  /index.html  200
```
