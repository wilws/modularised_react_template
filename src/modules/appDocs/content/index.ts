import type { DocEntry } from "../../../app/components";

/** Page content as plain data — the module's views only render it. */

export const appDocs: DocEntry[] = [
  {
    slug: "",
    title: "The app folder",
    path: "src/app/",
    intro:
      "The core. It owns the shell every page renders inside, the router, and the cross-cutting providers. It knows about exactly one thing from the outside: each module's routes.",
    blocks: [
      {
        heading: "What lives here",
        bullets: [
          "components/ — shared chrome plus Basic/, the UI primitive funnel",
          "hooks/ — custom hooks shared across the whole app",
          "locales/ — the translation engine and app-level strings",
          "providers/ — cross-cutting context",
          "router/ — the single place modules connect to the app",
          "config.ts — app-wide constants",
        ],
      },
      {
        heading: "app never imports from a module",
        body: "This is the rule that makes the core reusable. Nothing in app/ may import from modules/ — with exactly one exception, the router, which imports each module's routes and nothing else. If the core reached into a module, the module could no longer be deleted, moved or reused, and the dependency would run in both directions.",
        code: `// ✅ app/router/index.tsx — the one allowed import
import { homeRoutes } from "../../modules/home/router";

// ❌ anywhere else in app/
import { HomeHero } from "../../modules/home/views/Home";
import { dogLocale } from "../../modules/dogDemo/locales";`,
      },
      {
        heading: "The one seam",
        body: "src/app/router/index.tsx is the only file in app/ that imports from modules/. Everything else in the core is module-agnostic.",
        code: `import { homeRoutes } from "../../modules/home/router";

const moduleRoutes: RouteObject[] = [
  ...homeRoutes,
  ...appDocsRoutes,
];`,
      },
    ],
  },
  {
    slug: "router",
    title: "router",
    path: "src/app/router/index.tsx",
    intro:
      "The only wire between the app and its modules. Each module exports a RouteObject[]; the router spreads them into the shell.",
    blocks: [
      {
        heading: "How it works",
        body: "MainLayout is the element for the root route, so every module route renders inside the same chrome. ErrorPage catches both 404s and anything a route throws.",
        code: `const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      ...moduleRoutes,
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);`,
      },
      {
        heading: "Adding a module",
        body: "The module exports its routes; the app router spreads them in. Those two files are the entire registration.",
        code: `/* 1. the module declares its own routes */
// src/modules/order/router/index.tsx
import type { RouteObject } from "react-router-dom";
import { OrderList, OrderDetail } from "../views";

export const orderRoutes: RouteObject[] = [
  { path: "orders", element: <OrderList /> },
  { path: "orders/:orderId", element: <OrderDetail /> },
];

/* 2. the app router registers them — the ONLY app-side change */
// src/app/router/index.tsx
import { orderRoutes } from "../../modules/order/router";

const moduleRoutes: RouteObject[] = [
  ...homeRoutes,
  ...orderRoutes,
];`,
      },
      {
        heading: "Where the data comes from",
        body: "A module never fetches. If the new page needs a backend, add a resource under services/api/ and call it from the view — see the services pages for the schema, types and calling pattern.",
        code: `// in the view
import { api } from "../../../../services/api";

const orders = await api.orders.listOrders();`,
      },
    ],
  },
  {
    slug: "locales",
    title: "locales",
    path: "src/app/locales/",
    intro:
      "A typed translation layer in eight languages. A missing translation is a compile error, never a silent fallback to English.",
    blocks: [
      {
        heading: "Two scopes",
        bullets: [
          "useTranslation() — app chrome (header, footer, errors)",
          "useModuleTranslation(bundle) — strings a module owns",
        ],
        code: `const { t } = useTranslation();
t("nav.home");

const { t } = useModuleTranslation(homeLocale);
t("home.counter.value", { count: 42 });`,
      },
      {
        heading: "Why it cannot drift",
        body: "defineLocale requires every language key. Add a language to langKeyList and TypeScript errors on every bundle until it is filled in.",
        code: `export const homeLocale = defineLocale({
  EN: { "home.title": "Hello" },
  JP: { "home.title": "こんにちは" },
  // omit one language -> compile error
});`,
      },
      {
        heading: "Formatting",
        body: "useFormatters() gives locale-aware number and date formatting via Intl, so modules never hardcode a format.",
        code: `const { formatNumber, formatDate } = useFormatters();`,
      },
    ],
  },
  {
    slug: "providers",
    title: "providers",
    path: "src/app/providers/",
    intro:
      "Cross-cutting React context — anything more than one part of the app needs to read. The language provider is one example, not the only kind.",
    blocks: [
      {
        heading: "The pyramid you do not have to build",
        body: "The usual result of app-wide context is a stack of wrappers around the whole tree. Every provider pays its cost everywhere, even on pages that never read it — and a re-render at the top re-renders everything below.",
        code: `/* ❌ the shape this template avoids */
<ThemeProvider>
  <AuthProvider>
    <CartProvider>
      <SocketProvider>
        <AnalyticsProvider>
          <App />
        </AnalyticsProvider>
      </SocketProvider>
    </CartProvider>
  </AuthProvider>
</ThemeProvider>`,
      },
      {
        heading: "Wrap only where it is needed",
        body: "Because routes are plain objects, a provider can wrap a single route, a section, or one component. Only that subtree pays for it, and its state unmounts when you navigate away.",
        code: `/* ✅ scope it to one section, in the module's own router */
export const checkoutRoutes: RouteObject[] = [
  {
    path: "checkout",
    element: (
      <CartProvider>
        <CheckoutLayout />
      </CartProvider>
    ),
    children: [
      { index: true, element: <Basket /> },
      { path: "pay", element: <Payment /> },
    ],
  },
];

/* ✅ or around a single component */
<SocketProvider room={id}>
  <LiveComments />
</SocketProvider>`,
      },
      {
        heading: "What belongs at the root",
        body: "Only context that genuinely every page reads — the UI theme and the language. Everything else lives closer to its use.",
        code: `// src/app/App.tsx — deliberately shallow
<MantineProvider>
  <LangProvider>
    <RouterProvider router={router} />
  </LangProvider>
</MantineProvider>`,
      },
      {
        heading: "Example: an Auth provider",
        body: "Three files, matching how the language provider is split — a file that exports a component must export only components, or fast refresh breaks.",
        code: `/* src/app/providers/auth/types.ts */
export interface AuthUser {
  id: string;
  email: string;
}

export interface IAuthContext {
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

/* src/app/providers/auth/authContext.ts */
import { createContext, useContext } from "react";
import type { IAuthContext } from "./types";

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within <AuthProvider>");
  return context;
};

/* src/app/providers/auth/AuthProvider.tsx */
import { useMemo, useState, type ReactNode } from "react";
import { api } from "../../../services/api";
import { AuthContext } from "./authContext";
import type { AuthUser, IAuthContext } from "./types";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo<IAuthContext>(
    () => ({
      user,
      // the call itself lives in services — the provider only holds state
      signIn: async (email, password) => {
        setUser(await api.auth.signIn({ email, password }));
      },
      signOut: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};`,
      },
      {
        heading: "Then wrap only the routes that need it",
        body: "Public pages stay outside it, so they never mount the provider at all.",
        code: `export const accountRoutes: RouteObject[] = [
  {
    path: "account",
    element: (
      <AuthProvider>
        <AccountLayout />
      </AuthProvider>
    ),
    children: [{ index: true, element: <Profile /> }],
  },
];

// inside any component below it
const { user, signOut } = useAuth();`,
      },
      {
        heading: "Why the language provider is split in three",
        bullets: [
          "types.ts — language list, flags, BCP-47 tags, detection",
          "langContext.ts — the context and its hook",
          "LangProvider.tsx — the component",
        ],
        body: "Splitting these keeps fast refresh working, and it is the pattern any new provider should follow.",
      },
    ],
  },
  {
    slug: "components",
    title: "components",
    path: "src/app/components/",
    intro:
      "Two different things live here, and the distinction matters: Basic/ is the UI primitive funnel, and everything beside it is shared chrome. Use the menu to read each one.",
    blocks: [
      {
        heading: "Basic/ — the primitives",
        body: "Buttons, headings, text, inputs. Every primitive in the app comes from this one folder, so the UI library can be swapped, themed or patched in a single file.",
      },
      {
        heading: "components/ — the shared chrome",
        body: "Header, Footer, MainLayout, ErrorPage, DocPage. Components that genuinely appear across modules. The bar for putting something here is high — most components belong to a module instead.",
      },
    ],
  },
  {
    slug: "components/basic",
    title: "Basic — UI primitives",
    path: "src/app/components/Basic/index.tsx",
    intro:
      "One file re-exports the UI library. No file outside this folder imports that library directly, and none writes a raw button, h1 or p.",
    blocks: [
      {
        heading: "The rule",
        code: `// ✅ app chrome
import { Button, Title, Text } from "../Basic";

// ✅ inside a module
import { Button, Stack } from "../../../../app/components/Basic";

// ❌ never
import { Button } from "@mantine/core";
<button onClick={save}>Save</button>
<h1>Title</h1>`,
      },
      {
        heading: "Why funnel everything",
        body: "The library becomes an implementation detail. This template already swapped its UI library once — Semantic UI to Mantine — and the change touched one line, because nothing else ever named the library.",
      },
      {
        heading: "The primitive for each HTML tag",
        bullets: [
          "<button> → Button, ActionIcon, UnstyledButton",
          "<h1>–<h6> → Title with order={1..6}",
          "<p>, <span> → Text",
          "<a> → Anchor (routing: component={Link})",
          "<div> → Box, Stack, Group, Paper",
          "<ul>, <ol> → List + List.Item",
          "<input>, <select> → TextInput, Select, Checkbox",
        ],
      },
      {
        heading: "Overriding a primitive",
        body: "Write your own and re-export it after the wildcard so it wins. Every existing import then resolves to your version, with no call site touched.",
        code: `// src/app/components/Basic/index.tsx
export * from "@mantine/core";                 // everything
export { MyButton as Button } from "./Button"; // …except Button`,
      },
      {
        heading: "Checking compliance",
        code: `# raw HTML primitives outside Basic
grep -rnE "<(button|h1|h2|h3|p|a|input)[ >/]" src --include="*.tsx" \\
  | grep -v "components/Basic"

# direct library imports outside Basic
grep -rn 'from "@mantine' src --include="*.tsx" | grep -v "components/Basic"`,
      },
    ],
  },
  {
    slug: "components/component",
    title: "Components — shared vs module",
    path: "src/app/components/",
    intro:
      "The question is never \"is this a component?\" but \"who owns it?\". Most components belong to one module. Only genuinely cross-cutting chrome belongs here.",
    blocks: [
      {
        heading: "Why not put every component in one global folder",
        body: "The traditional shared components/ folder collects everything, including components used once in one corner of one page. It grows into hundreds of files nobody can safely change, because any of them might be used anywhere. Nobody wants to maintain that folder, and nobody dares delete from it.",
      },
      {
        heading: "Most components are modular",
        body: "A component used a few times inside one feature has no reason to be globally shareable. Keeping it in the module means it lives beside its only caller, it is deleted when the feature is deleted, and changing it can only affect that one module.",
        code: `src/modules/dogDemo/
├── views/DogDemo/          the page
└── components/BreedList/   ← used only by this page, so it lives here`,
      },
      {
        heading: "Where a component belongs",
        bullets: [
          "Used by one module → src/modules/<name>/components/",
          "Used by two modules → keep two copies, or ask whether it is really the same component",
          "Used by the shell itself (Header, Footer, layouts) → src/app/components/",
          "A UI primitive wrapping the library → src/app/components/Basic/",
        ],
        body: "Duplication across two modules is cheaper than a wrong shared abstraction. Promote a component only when a third caller proves the shape is stable.",
      },
      {
        heading: "What shared chrome looks like",
        code: `src/app/components/
├── Basic/            UI primitives (the funnel)
├── Header/           app-wide navigation
├── Footer/
├── MainLayout/       the shell every route renders inside
├── DocsLayout/       the two-column docs shell
├── DocPage/          renders a docs page from data
├── CodeBlock/        captioned code sample
└── ErrorPage/        404 + thrown errors`,
      },
      {
        heading: "The test before adding one here",
        body: "Would at least two unrelated modules break if this component disappeared? If not, it belongs to the module that uses it.",
      },
    ],
  },
  {
    slug: "hooks",
    title: "hooks",
    path: "src/app/hooks/",
    intro:
      "Custom hooks shared across the whole app. The same ownership rule as components applies: a hook used by one module belongs to that module, not here.",
    blocks: [
      {
        heading: "What belongs here",
        bullets: [
          "Hooks the shell itself uses (route tracking, layout measurements)",
          "Hooks genuinely used by unrelated modules",
          "Wrappers around app-wide context that are not the provider's own hook",
        ],
        body: "A hook that only one module calls belongs in src/modules/<name>/hooks/ instead.",
      },
      {
        heading: "Example: useAsync",
        body: "Every data-backed view repeats the same loading/error/try-catch block. One hook removes it, and it is a fair candidate for app/hooks because any module may need it.",
        code: `/* src/app/hooks/useAsync.ts */
import { useCallback, useState } from "react";

/**
 * Exposes the raw error rather than a message, so each caller decides how to
 * present it. Pass a stable task (a service function, or one wrapped in
 * useCallback), since run changes whenever it does.
 */
export const useAsync = <T,>(task: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await task());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [task]);

  return { data, loading, error, run };
};`,
      },
      {
        heading: "Using it in a view",
        body: "This module's useBreeds is built on it — the generic half was promoted to app/hooks, the feature-specific half stayed in the module.",
        code: `/* src/modules/dogDemo/hooks/useBreeds.ts */
const { data, loading, error, run } = useAsync(task);

// the module hook adds what only this feature needs
return {
  breeds: data?.breeds ?? [],
  photo: data?.photo ?? null,
  loading,
  error: message,   // the raw error, narrowed to a translated string
  load: run,
};`,
      },
      {
        heading: "Naming",
        body: "One hook per file, named after the hook, re-exported from src/app/hooks/index.ts — the same shape as components.",
        code: `src/app/hooks/
├── useAsync.ts
├── usePageview.ts
└── index.ts`,
      },
    ],
  },
];
