import type { DocEntry } from "../../../app/components";

export const modulesDocs: DocEntry[] = [
  {
    slug: "",
    title: "The modules folder",
    path: "src/modules/",
    intro:
      "One folder per page. A module is self-contained: it owns its views, its private components, its translations and its styles — and exposes nothing but routes.",
    blocks: [
      {
        heading: "Anatomy",
        bullets: [
          "router/ — the module's ONLY public surface",
          "views/ — page-level components",
          "components/ — components private to this module",
          "hooks/ — custom hooks private to this module",
          "locales/ — strings private to this module",
          "content/ — static data the views render",
        ],
      },
      {
        heading: "The three rules",
        bullets: [
          "A module owns its views, components, locales and styles.",
          "A module exposes routes only — it never imports app internals beyond shared helpers.",
          "Modules never import each other; they navigate by path.",
        ],
        body: "The third rule is what keeps the app from turning into a graph. To reach another page, link to its path — never import its code.",
      },
      {
        heading: "This site is the proof",
        body: "The page you are reading is a module. So is the home page, and each docs section. None of them import each other.",
      },
    ],
  },
  {
    slug: "router",
    title: "router",
    path: "src/modules/<name>/router/index.tsx",
    intro:
      "A module's entire public surface: an array of RouteObject. Nothing else leaves the folder.",
    blocks: [
      {
        heading: "The simplest module",
        code: `import type { RouteObject } from "react-router-dom";
import { Home } from "../views";

export const homeRoutes: RouteObject[] = [
  { index: true, element: <Home /> },
];`,
      },
      {
        heading: "A module with sub-pages",
        body: "Nest children under a layout element to get a section with its own inner navigation — exactly what these docs pages do.",
        code: `export const appDocsRoutes: RouteObject[] = [
  {
    path: "app",
    element: <DocsLayout title="app" sections={sections} />,
    children: [
      { index: true, element: <DocSection entry={overview} /> },
      { path: "router", element: <DocSection entry={router} /> },
    ],
  },
];`,
      },
    ],
  },
  {
    slug: "views",
    title: "views",
    path: "src/modules/<name>/views/",
    intro:
      "Page-level components — what a route actually renders. Views compose primitives from Basic and read strings from the module's locale.",
    blocks: [
      {
        heading: "What a view may import",
        bullets: [
          "app/components/Basic — UI primitives",
          "app/locales — the translation hooks",
          "its own module's components, locales and content",
        ],
        body: "A view never fetches, never validates, and never reaches into another module.",
      },
      {
        heading: "Shape",
        code: `export const Home = () => {
  const { t } = useModuleTranslation(homeLocale);

  return (
    <Stack gap="xl">
      <Title order={1}>{t("home.hero.title")}</Title>
      <Text>{t("home.hero.subtitle")}</Text>
    </Stack>
  );
};`,
      },
    ],
  },
  {
    slug: "locales",
    title: "locales",
    path: "src/modules/<name>/locales/index.ts",
    intro:
      "Strings the module owns. They are never registered with the app — the module passes its own bundle to the hook.",
    blocks: [
      {
        heading: "Self-contained translations",
        code: `export const homeLocale = defineLocale({
  EN: { "home.hero.title": "Modularised React Template" },
  JP: { "home.hero.title": "モジュール型 React テンプレート" },
  // ...all eight languages required
});`,
      },
      {
        heading: "Used only inside the module",
        code: `const { t } = useModuleTranslation(homeLocale);
t("home.hero.title");`,
      },
    ],
  },
  {
    slug: "hooks",
    title: "hooks",
    path: "src/modules/<name>/hooks/",
    intro:
      "Custom hooks belonging to one module. Anything stateful a view repeats — a form, a filter, a data load — becomes a hook here rather than a global one.",
    blocks: [
      {
        heading: "Why module-scoped",
        body: "A hook that only this feature calls has no reason to be globally shareable. Keeping it beside its caller means it is deleted with the feature, and changing it can only affect this module.",
        code: `src/modules/dogDemo/
├── views/DogDemo/        the page
├── components/BreedList/ private components
└── hooks/useBreeds.ts    ← private hook, used only here`,
      },
      {
        heading: "Example",
        body: "The demo view holds loading and error state inline. Pulling it into a module hook leaves the view with nothing but rendering.",
        code: `/* src/modules/dogDemo/hooks/useBreeds.ts */
import { useState } from "react";
import { api, type Dog } from "../../../services/api";

export const useBreeds = () => {
  const [breeds, setBreeds] = useState<Dog.IBreed[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setBreeds(await api.dogs.listBreeds());
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return { breeds, loading, error, load };
};`,
      },
      {
        heading: "The view becomes trivial",
        code: `const { breeds, loading, error, load } = useBreeds();

<Button onClick={load} loading={loading}>{t("dog.button")}</Button>
{error && <Alert color="red">{error}</Alert>}
{breeds.length > 0 && <BreedList breeds={breeds} />}`,
      },
      {
        heading: "When to promote it to app/hooks",
        body: "Only when an unrelated module needs the same hook. A generic useAsync belongs in app/hooks; useBreeds never will.",
      },
    ],
  },
  {
    slug: "adding",
    title: "Adding a page",
    path: "src/modules/<name>/",
    intro: "Three steps. Only the third touches anything outside the module.",
    blocks: [
      {
        heading: "1. Create the folder",
        code: `mkdir -p src/modules/about/{router,views/About,locales}`,
      },
      {
        heading: "2. Export its routes",
        code: `// src/modules/about/router/index.tsx
import type { RouteObject } from "react-router-dom";
import { About } from "../views";

export const aboutRoutes: RouteObject[] = [
  { path: "about", element: <About /> },
];`,
      },
      {
        heading: "3. Register it",
        body: "One line in the app router — the only app-side change. Add a nav item in Header if it needs a link.",
        code: `import { aboutRoutes } from "../../modules/about/router";

const moduleRoutes = [...homeRoutes, ...aboutRoutes];`,
      },
    ],
  },
];
