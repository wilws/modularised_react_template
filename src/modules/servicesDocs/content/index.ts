import type { DocEntry } from "../../../app/components";

export const servicesDocs: DocEntry[] = [
  {
    slug: "",
    title: "svc.overview.title",
    path: "src/services/",
    intro: "svc.overview.intro",
    blocks: [
      {
        heading: "svc.overview.b1.heading",
        body: "svc.overview.b1.body",
      },
      {
        heading: "svc.overview.b2.heading",
        code: `services/api/
├── user/
│   ├── index.ts     the fetch calls
│   ├── schema.ts    request + response zod schemas
│   └── types.ts     types inferred FROM the schemas
└── index.ts         groups resources into \`api\``,
      },
    ],
  },
  {
    slug: "validation",
    title: "svc.validation.title",
    path: "src/services/api/<resource>/schema.ts",
    intro: "svc.validation.intro",
    blocks: [
      {
        heading: "svc.validation.b1.heading",
        code: `export const viewProfile = async (payload: { userId: string }) => {
  const { userId } = UserSchemas.viewProfile.parse(payload);   // 1. request

  const response = await fetch(\`\${BASE_URL}/v1/users/\${userId}\`);
  if (!response.ok) throw new Error(\`Failed (\${response.status})\`);

  return UserResponseSchemas.profile.parse(await response.json());  // 2. response
};`,
      },
      {
        heading: "svc.validation.b2.heading",
        body: "svc.validation.b2.body",
      },
      {
        heading: "svc.validation.b3.heading",
        body: "svc.validation.b3.body",
        code: `export type IProfile = z.infer<typeof UserResponseSchemas.profile>;`,
      },
    ],
  },
  {
    slug: "calling",
    title: "svc.calling.title",
    path: "src/services/api/index.ts",
    intro: "svc.calling.intro",
    blocks: [
      {
        heading: "svc.calling.b1.heading",
        code: `/* src/services/api/index.ts */
import * as dogs from "./dog";
import * as users from "./user";

export const api = {
  users,
  dogs,
};`,
      },
      {
        heading: "svc.calling.b2.heading",
        bullets: [
          "svc.calling.b2.bullet1",
          "svc.calling.b2.bullet2",
          "svc.calling.b2.bullet3",
        ],
        body: "svc.calling.b2.body",
      },
      {
        heading: "svc.calling.b3.heading",
        body: "svc.calling.b3.body",
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
        heading: "svc.calling.b4.heading",
        body: "svc.calling.b4.body",
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
        heading: "svc.calling.b5.heading",
        body: "svc.calling.b5.body",
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
        heading: "svc.calling.b6.heading",
        body: "svc.calling.b6.body",
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
    title: "svc.adding.title",
    path: "src/services/api/<resource>/",
    intro: "svc.adding.intro",
    blocks: [
      {
        heading: "svc.adding.b1.heading",
        code: `src/services/api/order/
├── schema.ts    zod request + response schemas
├── types.ts     types inferred FROM those schemas
└── index.ts     the fetch calls`,
      },
      {
        heading: "svc.adding.b2.heading",
        body: "svc.adding.b2.body",
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
        heading: "svc.adding.b3.heading",
        body: "svc.adding.b3.body",
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
        heading: "svc.adding.b4.heading",
        body: "svc.adding.b4.body",
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
        heading: "svc.adding.b5.heading",
        body: "svc.adding.b5.body",
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
        heading: "svc.adding.b6.heading",
        code: `import { api } from "../../../../services/api";

const { orders, total } = await api.orders.listOrders({ status: "open" });
//      ^ fully typed, already validated — page defaults to 1`,
      },
      {
        heading: "svc.adding.b7.heading",
        body: "svc.adding.b7.body",
        code: `const BASE_URL = "https://dog.ceo/api";`,
      },
    ],
  },
  {
    slug: "testing",
    title: "svc.testing.title",
    path: "src/services/api/<resource>/index.test.ts",
    intro: "svc.testing.intro",
    blocks: [
      {
        heading: "svc.testing.b1.heading",
        body: "svc.testing.b1.body",
        code: `src/services/api/dog/
├── index.ts          the service
├── index.test.ts     ← its test, right beside it
├── schema.ts
└── types.ts`,
      },
      {
        heading: "svc.testing.b2.heading",
        code: `npm test          # run once
npm run test:watch  # re-run on change`,
      },
      {
        heading: "svc.testing.b3.heading",
        body: "svc.testing.b3.body",
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
        heading: "svc.testing.b4.heading",
        body: "svc.testing.b4.body",
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
        heading: "svc.testing.b5.heading",
        body: "svc.testing.b5.body",
        code: `it("rejects an empty breed before touching the network", async () => {
  const fetchSpy = vi.fn();
  vi.stubGlobal("fetch", fetchSpy);

  await expect(breedImage({ breed: "" })).rejects.toBeInstanceOf(z.ZodError);
  expect(fetchSpy).not.toHaveBeenCalled();
});`,
      },
      {
        heading: "svc.testing.b6.heading",
        body: "svc.testing.b6.body",
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
        heading: "svc.testing.b7.heading",
        bullets: [
          "svc.testing.b7.bullet1",
          "svc.testing.b7.bullet2",
          "svc.testing.b7.bullet3",
          "svc.testing.b7.bullet4",
          "svc.testing.b7.bullet5",
          "svc.testing.b7.bullet6",
        ],
      },
      {
        heading: "svc.testing.b8.heading",
        body: "svc.testing.b8.body",
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
