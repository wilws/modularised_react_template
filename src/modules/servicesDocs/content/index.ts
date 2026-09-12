import type { DocEntry } from "../../../app/components";

export const servicesDocs: DocEntry[] = [
  {
    slug: "",
    title: "The services folder",
    path: "src/services/",
    intro:
      "Every conversation with the outside world. The app and its modules render — they never fetch, and never validate.",
    blocks: [
      {
        heading: "Why it exists",
        body: "Fetching inside a component mixes three concerns: what to render, how to get data, and whether that data is trustworthy. Moving the last two here leaves views doing one job.",
      },
      {
        heading: "Layout",
        code: `services/api/
├── user/
│   ├── index.ts     the fetch calls
│   ├── schema.ts    request + response zod schemas
│   └── types.ts     types inferred FROM the schemas
└── index.ts         groups resources into \`api\``,
      },
      {
        heading: "No framework",
        body: "There is no shared client, no wrapper, no base payload. A resource is a plain file of async functions calling fetch — so a third-party endpoint just uses its own URL, and one that needs no token simply doesn't send one.",
      },
    ],
  },
  {
    slug: "validation",
    title: "Validation",
    path: "src/services/api/<resource>/schema.ts",
    intro:
      "Every call validates twice: the payload before sending, the response before returning. That is what lets components skip checking entirely.",
    blocks: [
      {
        heading: "Both ends guarded",
        code: `export const viewProfile = async (payload: { userId: string }) => {
  const { userId } = UserSchemas.viewProfile.parse(payload);   // 1. request

  const response = await fetch(\`\${BASE_URL}/v1/users/\${userId}\`);
  if (!response.ok) throw new Error(\`Failed (\${response.status})\`);

  return UserResponseSchemas.profile.parse(await response.json());  // 2. response
};`,
      },
      {
        heading: "The guarantee",
        body: "A resolved promise means the data matched the schema. A view renders profile.email with no null check, no cast, and no defensive optional chaining.",
      },
      {
        heading: "Types are inferred",
        body: "Types come from the schemas, never hand-written — so changing a schema is a compile error at every call site that no longer fits.",
        code: `export type IProfile = z.infer<typeof UserResponseSchemas.profile>;`,
      },
    ],
  },
  {
    slug: "calling",
    title: "Calling a service",
    path: "src/services/api/index.ts",
    intro:
      "Resources are grouped into one api object, so a view calls api.users.xxx() and never constructs anything.",
    blocks: [
      {
        heading: "From a view",
        code: `import { api } from "../../../../services/api";

useEffect(() => {
  api.users.listUsers().then(setUsers).catch(console.error);
}, []);`,
      },
      {
        heading: "The api object",
        code: `import * as users from "./user";

export const api = {
  users,
  // orders,
};`,
      },
    ],
  },
  {
    slug: "adding",
    title: "Adding a resource",
    path: "src/services/api/<resource>/",
    intro: "Three files, then one line to register it.",
    blocks: [
      {
        heading: "1. The folder",
        code: `src/services/api/order/
├── index.ts     the fetch calls
├── schema.ts    OrderSchemas + OrderResponseSchemas
└── types.ts     z.infer from those schemas`,
      },
      {
        heading: "2. Register it",
        code: `import * as orders from "./order";

export const api = {
  users,
  orders,     // ← now api.orders.xxx()
};`,
      },
      {
        heading: "3. Third-party endpoints",
        body: "Identical, with its own base URL and whatever headers that endpoint needs — or none.",
        code: `const BASE_URL = "https://api.github.com";`,
      },
    ],
  },
];
