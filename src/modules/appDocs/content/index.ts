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
          "locales/ — the translation engine and app-level strings",
          "providers/ — cross-cutting context (language)",
          "router/ — the single place modules connect to the app",
          "config.ts — app-wide constants",
        ],
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
        body: "Import its routes and spread them in. That single line is the entire registration.",
        code: `import { orderRoutes } from "../../modules/order/router";

const moduleRoutes = [...homeRoutes, ...orderRoutes];`,
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
      "Cross-cutting React context. The language provider stores the active language, persists it, and mirrors it onto the html lang attribute.",
    blocks: [
      {
        heading: "Split by role",
        bullets: [
          "types.ts — language list, flags, BCP-47 tags, detection",
          "langContext.ts — the context and its hook",
          "LangProvider.tsx — the component",
        ],
        body: "Splitting these keeps fast refresh working: a file that exports a component must export only components.",
      },
      {
        heading: "Detection order",
        body: "Stored choice first, then the browser language (including Hant vs Hans), then English.",
        code: `const stored = localStorage.getItem("app.langKey");
if (isLangKey(stored)) return stored;
if (browser.startsWith("ja")) return "JP";`,
      },
    ],
  },
  {
    slug: "components",
    title: "components",
    path: "src/app/components/",
    intro:
      "Shared chrome — Header, Footer, MainLayout, ErrorPage — plus Basic/, which is where every UI primitive comes from.",
    blocks: [
      {
        heading: "The Basic rule",
        body: "No file outside Basic/ imports a UI library directly, and none writes a raw button, h1 or p. Everything funnels through one file, so the library can be swapped in one place.",
        code: `// ✅
import { Button, Title } from "../Basic";

// ❌
import { Button } from "@mantine/core";
<button>Save</button>`,
      },
      {
        heading: "Overriding a primitive",
        body: "Write your own and re-export it after the wildcard so it wins. Every existing import then resolves to your version.",
        code: `export * from "@mantine/core";
export { MyButton as Button } from "./Button";`,
      },
    ],
  },
];
