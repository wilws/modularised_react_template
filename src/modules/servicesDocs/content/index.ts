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
      "Resources are grouped into one api object, so a view calls api.users.xxx() and never constructs anything. What it does have to handle is failure.",
    blocks: [
      {
        heading: "The api object",
        code: `/* src/services/api/index.ts */
import * as dogs from "./dog";
import * as users from "./user";

export const api = {
  users,
  dogs,
};`,
      },
      {
        heading: "Three ways a call can fail",
        bullets: [
          "ZodError — the payload you sent, or the response you got, did not match the schema",
          "Error from the service — a non-2xx response",
          "TypeError from fetch — the network never reached the server",
        ],
        body: "A ZodError on the response means the backend changed shape. That is a different problem from a 500, and worth separating: one is a bug to report, the other is something the user can retry.",
      },
      {
        heading: "Handling them properly",
        body: "Zod ships a type guard, so a schema failure is distinguishable without parsing error strings. `z.prettifyError` turns the issue list into readable text.",
        code: `/* src/modules/dogDemo/views/DogDemo/index.tsx */
import { z } from "zod";
import { api, type Dog } from "../../../../services/api";

const [breeds, setBreeds] = useState<Dog.IBreed[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const load = async () => {
  setLoading(true);
  setError(null);

  try {
    // No URL, no envelope, no validation — the service did all three.
    setBreeds(await api.dogs.listBreeds());
  } catch (err) {
    if (err instanceof z.ZodError) {
      // The API's shape changed, or we sent something invalid.
      // err.issues is [{ path, message, code }] — log it, don't show it raw.
      console.error("schema mismatch", z.prettifyError(err));
      setError(t("dog.error.schema"));
    } else if (err instanceof Error) {
      setError(err.message);            // HTTP or network failure
    } else {
      setError(String(err));
    }
  } finally {
    setLoading(false);
  }
};`,
      },
      {
        heading: "Reading a ZodError",
        body: "Each issue names the exact path that failed, which is usually enough to see what the backend changed.",
        code: `catch (err) {
  if (err instanceof z.ZodError) {
    for (const issue of err.issues) {
      console.error(issue.path.join("."), issue.message);
      // e.g.  "message.hound"   Expected array, received string
    }
  }
}`,
      },
      {
        heading: "Field errors on a form",
        body: "For a payload that failed validation, flatten the issues by field and show them next to the inputs instead of as one banner.",
        code: `const fieldErrors: Record<string, string> = {};

if (err instanceof z.ZodError) {
  for (const issue of err.issues) {
    fieldErrors[issue.path.join(".")] = issue.message;
  }
}

<TextInput
  label="Breed"
  value={breed}
  error={fieldErrors.breed}
  onChange={(e) => setBreed(e.currentTarget.value)}
/>;`,
      },
      {
        heading: "Or validate before calling",
        body: "The schemas are exported, so a form can check a payload with safeParse and never reach the network with something it knows is invalid.",
        code: `import { DogSchemas } from "../../../../services/api/dog";

const result = DogSchemas.breedImage.safeParse({ breed });

if (!result.success) {
  setFieldError(result.error.issues[0].message);
  return;
}

await api.dogs.breedImage(result.data);`,
      },
    ],
  },
  {
    slug: "adding",
    title: "Adding a resource",
    path: "src/services/api/<resource>/",
    intro:
      "Three files, then one line to register it. Below is a complete order resource, file by file.",
    blocks: [
      {
        heading: "The folder",
        code: `src/services/api/order/
├── schema.ts    zod request + response schemas
├── types.ts     types inferred FROM those schemas
└── index.ts     the fetch calls`,
      },
      {
        heading: "1. schema.ts — the contract",
        body: "Request schemas validate what you send; response schemas validate what comes back. Both live here, and nothing else in the app describes this data.",
        code: `/* src/services/api/order/schema.ts */
import { z } from "zod";

/** Request payloads — validated before the call leaves the app. */
export const OrderSchemas = {
  list: z.object({
    status: z.enum(["open", "paid", "shipped"]).optional(),
    page: z.number().int().positive().default(1),
  }),

  create: z.object({
    items: z
      .array(
        z.object({
          sku: z.string().min(1, { message: "SKU is required" }),
          quantity: z.number().int().positive(),
        }),
      )
      .min(1, { message: "An order needs at least one item" }),
    note: z.string().max(200).optional(),
  }),

  byId: z.object({
    orderId: z.string().min(1, { message: "Order id is required" }),
  }),
};

/** Response shapes — validated after the call returns. */
const OrderSchema = z.object({
  id: z.string(),
  status: z.enum(["open", "paid", "shipped"]),
  total: z.number(),
  items: z.array(
    z.object({ sku: z.string(), quantity: z.number(), price: z.number() }),
  ),
  createdAt: z.iso.datetime(),
});

export const OrderResponseSchemas = {
  order: OrderSchema,
  list: z.object({
    orders: z.array(OrderSchema),
    total: z.number(),
  }),
};`,
      },
      {
        heading: "2. types.ts — inferred, never hand-written",
        body: "Every type comes from a schema via z.infer. Change the schema and each call site that no longer fits fails to compile — the types cannot drift from what the API actually returns.",
        code: `/* src/services/api/order/types.ts */
import type { z } from "zod";
import type { OrderResponseSchemas, OrderSchemas } from "./schema";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Order {
  // request payloads
  export type IListPayload = z.infer<typeof OrderSchemas.list>;
  export type ICreatePayload = z.infer<typeof OrderSchemas.create>;
  export type IByIdPayload = z.infer<typeof OrderSchemas.byId>;

  // response shapes
  export type IOrder = z.infer<typeof OrderResponseSchemas.order>;
  export type IList = z.infer<typeof OrderResponseSchemas.list>;

  // a single item, pulled out of the order it belongs to
  export type IOrderItem = IOrder["items"][number];
}`,
      },
      {
        heading: "3. index.ts — the calls",
        body: "Each function validates its payload, calls fetch, checks the status, then validates the response. Nothing leaves this file unvalidated.",
        code: `/* src/services/api/order/index.ts */
import { OrderResponseSchemas, OrderSchemas } from "./schema";
import type { Order } from "./types";

export { OrderSchemas, OrderResponseSchemas } from "./schema";
export type { Order } from "./types";

const BASE_URL = import.meta.env?.VITE_API_BASE_URL ?? "/api";

/** GET /v1/orders */
export const listOrders = async (
  payload: Order.IListPayload,
): Promise<Order.IList> => {
  const { status, page } = OrderSchemas.list.parse(payload);

  const query = new URLSearchParams({ page: String(page) });
  if (status) query.set("status", status);

  const response = await fetch(\`\${BASE_URL}/v1/orders?\${query}\`);
  if (!response.ok) throw new Error(\`Failed to list orders (\${response.status})\`);

  return OrderResponseSchemas.list.parse(await response.json());
};

/** GET /v1/orders/:orderId */
export const viewOrder = async (
  payload: Order.IByIdPayload,
): Promise<Order.IOrder> => {
  const { orderId } = OrderSchemas.byId.parse(payload);

  const response = await fetch(\`\${BASE_URL}/v1/orders/\${orderId}\`);
  if (!response.ok) throw new Error(\`Failed to load order (\${response.status})\`);

  return OrderResponseSchemas.order.parse(await response.json());
};

/** POST /v1/orders */
export const createOrder = async (
  payload: Order.ICreatePayload,
): Promise<Order.IOrder> => {
  const body = OrderSchemas.create.parse(payload);

  const response = await fetch(\`\${BASE_URL}/v1/orders\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(\`Failed to create order (\${response.status})\`);

  return OrderResponseSchemas.order.parse(await response.json());
};`,
      },
      {
        heading: "4. Register it",
        body: "One import and one key — the only edit outside the resource folder.",
        code: `/* src/services/api/index.ts */
import * as dogs from "./dog";
import * as orders from "./order";
import * as users from "./user";

export const api = {
  users,
  dogs,
  orders,     // ← now api.orders.listOrders()
};

export type { Order } from "./order";`,
      },
      {
        heading: "Using it",
        code: `import { api } from "../../../../services/api";

const { orders, total } = await api.orders.listOrders({ status: "open" });
//      ^ fully typed, already validated — page defaults to 1`,
      },
      {
        heading: "Third-party resources",
        body: "Identical, with its own base URL and whatever headers that endpoint needs — or none at all. See src/services/api/dog/, which calls a public API with no auth.",
        code: `const BASE_URL = "https://dog.ceo/api";`,
      },
    ],
  },
  {
    slug: "testing",
    title: "Testing a service",
    path: "src/services/api/<resource>/index.test.ts",
    intro:
      "Services are plain async functions, so they test without React, without a renderer and without a running app. The test sits beside the service it covers.",
    blocks: [
      {
        heading: "Why this is the right layer to test",
        body: "All the logic worth testing already lives here: URL building, payload validation, response validation, envelope unwrapping and error handling. A component test would re-test React; a service test covers the part that can actually be wrong.",
        code: `src/services/api/dog/
├── index.ts          the service
├── index.test.ts     ← its test, right beside it
├── schema.ts
└── types.ts`,
      },
      {
        heading: "Running them",
        code: `npm test          # run once
npm run test:watch  # re-run on change`,
      },
      {
        heading: "Mocking fetch",
        body: "Stub the global and return a real Response. Nothing else needs faking, because the service takes no client and no config object.",
        code: `/* src/services/api/dog/index.test.ts */
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { listBreeds } from "./index";

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

afterEach(() => {
  vi.unstubAllGlobals();
});

it("unwraps the { message, status } envelope into a plain list", async () => {
  vi.stubGlobal("fetch", vi.fn(async () =>
    jsonResponse({
      message: { hound: ["afghan", "basset"], akita: [] },
      status: "success",
    }),
  ));

  await expect(listBreeds()).resolves.toEqual([
    { name: "hound", subBreeds: ["afghan", "basset"] },
    { name: "akita", subBreeds: [] },
  ]);
});`,
      },
      {
        heading: "Test that a bad response is rejected",
        body: "This is the test that earns the schemas. If the API starts returning a string where an array was promised, the service must throw rather than hand the wrong shape to a view.",
        code: `it("throws a ZodError when the response shape changes", async () => {
  // sub-breeds arrive as a string instead of an array
  vi.stubGlobal("fetch", vi.fn(async () =>
    jsonResponse({ message: { hound: "afghan" }, status: "success" }),
  ));

  await expect(listBreeds()).rejects.toBeInstanceOf(z.ZodError);
});

it("names the offending field", async () => {
  vi.stubGlobal("fetch", vi.fn(async () =>
    jsonResponse({ message: { hound: "afghan" }, status: "success" }),
  ));

  const error = await listBreeds().catch((err: unknown) => err);
  expect((error as z.ZodError).issues[0].path).toEqual(["message", "hound"]);
});`,
      },
      {
        heading: "Test that a bad payload never reaches the network",
        body: "Request validation runs before fetch, so an invalid payload should fail without a call being made. Asserting the spy was never called is what proves it.",
        code: `it("rejects an empty breed before touching the network", async () => {
  const fetchSpy = vi.fn();
  vi.stubGlobal("fetch", fetchSpy);

  await expect(breedImage({ breed: "" })).rejects.toBeInstanceOf(z.ZodError);
  expect(fetchSpy).not.toHaveBeenCalled();
});`,
      },
      {
        heading: "Test the request itself",
        body: "For writes, assert the method, the URL and the body — including what is deliberately left out. updateProfile takes a userId but must send it in the path, not the payload.",
        code: `it("sends only the changed fields, not the id", async () => {
  const fetchSpy = vi.fn<typeof fetch>(async () => jsonResponse(profile));
  vi.stubGlobal("fetch", fetchSpy);

  await updateProfile({ userId: "usr_1", givenName: "Grace" });

  const [url, init] = fetchSpy.mock.calls[0];
  expect(url).toBe("/api/v1/users/usr_1");
  expect(init?.method).toBe("PATCH");
  expect(JSON.parse(init?.body as string)).toEqual({ givenName: "Grace" });
});`,
      },
      {
        heading: "What to cover for each call",
        bullets: [
          "the happy path — data comes back in the shape the view expects",
          "the URL that was requested, and the body that was sent",
          "an invalid payload rejects, and fetch is never called",
          "a malformed response throws a ZodError instead of leaking",
          "a non-2xx response throws with its status code",
          "a network failure propagates rather than resolving empty",
        ],
      },
      {
        heading: "Integration testing",
        body: "Because a service is just a function, the same test file can run against the real API instead of a mock — drop the stub and call it directly. That turns the suite into a contract check: it fails when the backend changes shape, which is the failure a mocked test can never catch. Keep those in a separate file or behind a flag, so the everyday suite stays offline and fast.",
        code: `// no vi.stubGlobal — this hits the real dog.ceo API
it("returns a list of real breeds", async () => {
  const breeds = await listBreeds();

  expect(breeds.length).toBeGreaterThan(50);
  expect(breeds.find((b) => b.name === "hound")?.subBreeds).toContain("afghan");
});`,
      },
    ],
  },
];
