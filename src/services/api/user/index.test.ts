/* ************************************
 * ------- User Service — unit --------
 * ************************************/
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { listUsers, updateProfile, viewProfile } from "./index";

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

const mockFetch = (impl: () => Promise<Response>) => {
  vi.stubGlobal("fetch", vi.fn(impl));
};

/** A fetch spy typed as fetch, so calls[0] is [url, init] rather than []. */
const spyFetch = (impl: () => Promise<Response> = async () => jsonResponse({})) =>
  vi.fn<typeof fetch>(impl as unknown as typeof fetch);

/** A profile that satisfies the response schema. */
const profile = {
  id: "usr_1",
  email: "ada@example.com",
  givenName: "Ada",
  familyName: "Lovelace",
  picture: null,
  createdAt: "2026-01-01T00:00:00.000Z",
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("listUsers", () => {
  it("returns the validated list", async () => {
    mockFetch(async () =>
      jsonResponse([
        { id: "usr_1", email: "ada@example.com", givenName: "Ada", familyName: null },
      ]),
    );

    const users = await listUsers();

    expect(users).toHaveLength(1);
    expect(users[0].email).toBe("ada@example.com");
  });

  it("needs no payload and no auth header", async () => {
    const fetchSpy = spyFetch(async () => jsonResponse([]));
    vi.stubGlobal("fetch", fetchSpy);

    await listUsers();

    expect(fetchSpy).toHaveBeenCalledWith("/api/v1/users");
    expect(fetchSpy.mock.calls[0][1]).toBeUndefined();
  });

  it("throws a ZodError when an email is malformed", async () => {
    mockFetch(async () =>
      jsonResponse([
        { id: "usr_1", email: "not-an-email", givenName: null, familyName: null },
      ]),
    );

    await expect(listUsers()).rejects.toBeInstanceOf(z.ZodError);
  });

  it("throws with the status code on a non-2xx response", async () => {
    mockFetch(async () => new Response("nope", { status: 503 }));

    await expect(listUsers()).rejects.toThrow(/503/);
  });
});

describe("viewProfile", () => {
  it("returns the validated profile", async () => {
    mockFetch(async () => jsonResponse(profile));

    await expect(viewProfile({ userId: "usr_1" })).resolves.toEqual(profile);
  });

  it("puts the user id in the url", async () => {
    const fetchSpy = spyFetch(async () => jsonResponse(profile));
    vi.stubGlobal("fetch", fetchSpy);

    await viewProfile({ userId: "usr_42" });

    expect(fetchSpy).toHaveBeenCalledWith("/api/v1/users/usr_42");
  });

  it("rejects an empty id before touching the network", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    await expect(viewProfile({ userId: "" })).rejects.toBeInstanceOf(z.ZodError);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("throws when a required field is missing from the response", async () => {
    const incomplete = { ...profile, email: undefined };
    mockFetch(async () => jsonResponse(incomplete));

    const error = await viewProfile({ userId: "usr_1" }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(z.ZodError);
    expect((error as z.ZodError).issues[0].path).toEqual(["email"]);
  });
});

describe("updateProfile", () => {
  it("sends only the changed fields, not the id", async () => {
    const fetchSpy = spyFetch(async () => jsonResponse(profile));
    vi.stubGlobal("fetch", fetchSpy);

    await updateProfile({ userId: "usr_1", givenName: "Grace" });

    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/v1/users/usr_1");
    expect(init?.method).toBe("PATCH");
    expect(JSON.parse(init?.body as string)).toEqual({ givenName: "Grace" });
  });

  it("sets the JSON content type", async () => {
    const fetchSpy = spyFetch(async () => jsonResponse(profile));
    vi.stubGlobal("fetch", fetchSpy);

    await updateProfile({ userId: "usr_1", givenName: "Grace" });

    const [, init] = fetchSpy.mock.calls[0];
    expect(init?.headers).toMatchObject({ "Content-Type": "application/json" });
  });

  it("rejects a name containing digits", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const error = await updateProfile({
      userId: "usr_1",
      givenName: "Ada123",
    }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(z.ZodError);
    expect((error as z.ZodError).issues[0].message).toMatch(/letters and spaces/);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("accepts a null picture", async () => {
    const fetchSpy = spyFetch(async () => jsonResponse(profile));
    vi.stubGlobal("fetch", fetchSpy);

    await updateProfile({ userId: "usr_1", picture: null });

    const [, init] = fetchSpy.mock.calls[0];
    expect(JSON.parse(init?.body as string)).toEqual({ picture: null });
  });
});
