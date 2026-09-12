import type { DocEntry } from "../../../app/components";

export const modulesDocs: DocEntry[] = [
  {
    slug: "",
    title: "mod.overview.title",
    path: "src/modules/",
    intro: "mod.overview.intro",
    blocks: [
      {
        heading: "mod.overview.b1.heading",
        bullets: [
          "mod.overview.b1.bullet1",
          "mod.overview.b1.bullet2",
          "mod.overview.b1.bullet3",
          "mod.overview.b1.bullet4",
          "mod.overview.b1.bullet5",
          "mod.overview.b1.bullet6",
        ],
      },
      {
        heading: "mod.overview.b2.heading",
        bullets: [
          "mod.overview.b2.bullet1",
          "mod.overview.b2.bullet2",
          "mod.overview.b2.bullet3",
        ],
        body: "mod.overview.b2.body",
      },
      {
        heading: "mod.overview.b3.heading",
        body: "mod.overview.b3.body",
      },
    ],
  },
  {
    slug: "router",
    title: "mod.router.title",
    path: "src/modules/<name>/router/index.tsx",
    intro: "mod.router.intro",
    blocks: [
      {
        heading: "mod.router.b1.heading",
        code: `import type { RouteObject } from "react-router-dom";
import { Home } from "../views";

export const homeRoutes: RouteObject[] = [
  { index: true, element: <Home /> },
];`,
      },
      {
        heading: "mod.router.b2.heading",
        body: "mod.router.b2.body",
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
    title: "mod.views.title",
    path: "src/modules/<name>/views/",
    intro: "mod.views.intro",
    blocks: [
      {
        heading: "mod.views.b1.heading",
        bullets: [
          "mod.views.b1.bullet1",
          "mod.views.b1.bullet2",
          "mod.views.b1.bullet3",
        ],
        body: "mod.views.b1.body",
      },
      {
        heading: "mod.views.b2.heading",
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
    title: "mod.locales.title",
    path: "src/modules/<name>/locales/index.ts",
    intro: "mod.locales.intro",
    blocks: [
      {
        heading: "mod.locales.b1.heading",
        code: `export const homeLocale = defineLocale({
  EN: { "home.hero.title": "Modularised React Template" },
  JP: { "home.hero.title": "モジュール型 React テンプレート" },
  // ...all eight languages required
});`,
      },
      {
        heading: "mod.locales.b2.heading",
        code: `const { t } = useModuleTranslation(homeLocale);
t("home.hero.title");`,
      },
    ],
  },
  {
    slug: "hooks",
    title: "mod.hooks.title",
    path: "src/modules/<name>/hooks/",
    intro: "mod.hooks.intro",
    blocks: [
      {
        heading: "mod.hooks.b1.heading",
        body: "mod.hooks.b1.body",
        code: `src/modules/dogDemo/
├── views/DogDemo/        the page
├── components/BreedList/ private components
└── hooks/useBreeds.ts    ← private hook, used only here`,
      },
      {
        heading: "mod.hooks.b2.heading",
        body: "mod.hooks.b2.body",
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
        heading: "mod.hooks.b3.heading",
        code: `const { breeds, loading, error, load } = useBreeds();

<Button onClick={load} loading={loading}>{t("dog.button")}</Button>
{error && <Alert color="red">{error}</Alert>}
{breeds.length > 0 && <BreedList breeds={breeds} />}`,
      },
      {
        heading: "mod.hooks.b4.heading",
        body: "mod.hooks.b4.body",
      },
    ],
  },
  {
    slug: "adding",
    title: "mod.adding.title",
    path: "src/modules/<name>/",
    intro: "mod.adding.intro",
    blocks: [
      {
        heading: "mod.adding.b1.heading",
        code: `mkdir -p src/modules/about/{router,views/About,locales}`,
      },
      {
        heading: "mod.adding.b2.heading",
        code: `// src/modules/about/router/index.tsx
import type { RouteObject } from "react-router-dom";
import { About } from "../views";

export const aboutRoutes: RouteObject[] = [
  { path: "about", element: <About /> },
];`,
      },
      {
        heading: "mod.adding.b3.heading",
        body: "mod.adding.b3.body",
        code: `import { aboutRoutes } from "../../modules/about/router";

const moduleRoutes = [...homeRoutes, ...aboutRoutes];`,
      },
    ],
  },
];
