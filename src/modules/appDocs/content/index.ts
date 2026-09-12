import type { DocEntry } from "../../../app/components";

/** Page content as plain data — the module's views only render it. */

export const appDocs: DocEntry[] = [
  {
    slug: "",
    title: "app.overview.title",
    path: "src/app/",
    intro: "app.overview.intro",
    blocks: [
      {
        heading: "app.overview.b1.heading",
        bullets: [
          "app.overview.b1.bullet1",
          "app.overview.b1.bullet2",
          "app.overview.b1.bullet3",
          "app.overview.b1.bullet4",
          "app.overview.b1.bullet5",
          "app.overview.b1.bullet6",
        ],
      },
      {
        heading: "app.overview.b2.heading",
        body: "app.overview.b2.body",
        code: `// ✅ app/router/index.tsx — the one allowed import
import { homeRoutes } from "../../modules/home/router";

// ❌ anywhere else in app/
import { HomeHero } from "../../modules/home/views/Home";
import { dogLocale } from "../../modules/dogDemo/locales";`,
      },
      {
        heading: "app.overview.b3.heading",
        body: "app.overview.b3.body",
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
    title: "app.router.title",
    path: "src/app/router/index.tsx",
    intro: "app.router.intro",
    blocks: [
      {
        heading: "app.router.b1.heading",
        body: "app.router.b1.body",
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
        heading: "app.router.b2.heading",
        body: "app.router.b2.body",
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
        heading: "app.router.b3.heading",
        body: "app.router.b3.body",
        code: `// in the view
import { api } from "../../../../services/api";

const orders = await api.orders.listOrders();`,
      },
    ],
  },
  {
    slug: "locales",
    title: "app.locales.title",
    path: "src/app/locales/",
    intro: "app.locales.intro",
    blocks: [
      {
        heading: "app.locales.b1.heading",
        bullets: [
          "app.locales.b1.bullet1",
          "app.locales.b1.bullet2",
        ],
        code: `const { t } = useTranslation();
t("nav.home");

const { t } = useModuleTranslation(homeLocale);
t("home.counter.value", { count: 42 });`,
      },
      {
        heading: "app.locales.b2.heading",
        body: "app.locales.b2.body",
        code: `export const homeLocale = defineLocale({
  EN: { "home.title": "Hello" },
  JP: { "home.title": "こんにちは" },
  // omit one language -> compile error
});`,
      },
      {
        heading: "app.locales.b3.heading",
        body: "app.locales.b3.body",
        code: `const { formatNumber, formatDate } = useFormatters();`,
      },
    ],
  },
  {
    slug: "providers",
    title: "app.providers.title",
    path: "src/app/providers/",
    intro: "app.providers.intro",
    blocks: [
      {
        heading: "app.providers.b1.heading",
        body: "app.providers.b1.body",
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
        heading: "app.providers.b2.heading",
        body: "app.providers.b2.body",
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
        heading: "app.providers.b3.heading",
        body: "app.providers.b3.body",
        code: `// src/app/App.tsx — deliberately shallow
<MantineProvider>
  <LangProvider>
    <RouterProvider router={router} />
  </LangProvider>
</MantineProvider>`,
      },
      {
        heading: "app.providers.b4.heading",
        body: "app.providers.b4.body",
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
        heading: "app.providers.b5.heading",
        body: "app.providers.b5.body",
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
        heading: "app.providers.b6.heading",
        bullets: [
          "app.providers.b6.bullet1",
          "app.providers.b6.bullet2",
          "app.providers.b6.bullet3",
        ],
        body: "app.providers.b6.body",
      },
    ],
  },
  {
    slug: "components",
    title: "app.components.title",
    path: "src/app/components/",
    intro: "app.components.intro",
    blocks: [
      {
        heading: "app.components.b1.heading",
        body: "app.components.b1.body",
      },
      {
        heading: "app.components.b2.heading",
        body: "app.components.b2.body",
      },
    ],
  },
  {
    slug: "components/basic",
    title: "app.components/basic.title",
    path: "src/app/components/Basic/index.tsx",
    intro: "app.components/basic.intro",
    blocks: [
      {
        heading: "app.components/basic.b1.heading",
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
        heading: "app.components/basic.b2.heading",
        body: "app.components/basic.b2.body",
      },
      {
        heading: "app.components/basic.b3.heading",
        bullets: [
          "app.components/basic.b3.bullet1",
          "app.components/basic.b3.bullet2",
          "app.components/basic.b3.bullet3",
          "app.components/basic.b3.bullet4",
          "app.components/basic.b3.bullet5",
          "app.components/basic.b3.bullet6",
          "app.components/basic.b3.bullet7",
        ],
      },
      {
        heading: "app.components/basic.b4.heading",
        body: "app.components/basic.b4.body",
        code: `// src/app/components/Basic/index.tsx
export * from "@mantine/core";                 // everything
export { MyButton as Button } from "./Button"; // …except Button`,
      },
      {
        heading: "app.components/basic.b5.heading",
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
    title: "app.components/component.title",
    path: "src/app/components/",
    intro: "app.components/component.intro",
    blocks: [
      {
        heading: "app.components/component.b1.heading",
        body: "app.components/component.b1.body",
      },
      {
        heading: "app.components/component.b2.heading",
        body: "app.components/component.b2.body",
        code: `src/modules/dogDemo/
├── views/DogDemo/          the page
└── components/BreedList/   ← used only by this page, so it lives here`,
      },
      {
        heading: "app.components/component.b3.heading",
        bullets: [
          "app.components/component.b3.bullet1",
          "app.components/component.b3.bullet2",
          "app.components/component.b3.bullet3",
          "app.components/component.b3.bullet4",
        ],
        body: "app.components/component.b3.body",
      },
      {
        heading: "app.components/component.b4.heading",
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
        heading: "app.components/component.b5.heading",
        body: "app.components/component.b5.body",
      },
    ],
  },
  {
    slug: "hooks",
    title: "app.hooks.title",
    path: "src/app/hooks/",
    intro: "app.hooks.intro",
    blocks: [
      {
        heading: "app.hooks.b1.heading",
        bullets: [
          "app.hooks.b1.bullet1",
          "app.hooks.b1.bullet2",
          "app.hooks.b1.bullet3",
        ],
        body: "app.hooks.b1.body",
      },
      {
        heading: "app.hooks.b2.heading",
        body: "app.hooks.b2.body",
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
        heading: "app.hooks.b3.heading",
        body: "app.hooks.b3.body",
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
        heading: "app.hooks.b4.heading",
        body: "app.hooks.b4.body",
        code: `src/app/hooks/
├── useAsync.ts
├── usePageview.ts
└── index.ts`,
      },
    ],
  },
];
