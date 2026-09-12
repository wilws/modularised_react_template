/* ************************************
 * ------- Dog Service — unit ---------
 * ************************************/
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { breedImage, listBreeds } from "./index";

/** Builds a JSON Response, so each test only states the body it cares about. */
const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

const mockFetch = (impl: () => Promise<Response>) => {
  vi.stubGlobal("fetch", vi.fn(impl));
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("listBreeds", () => {
  it("unwraps the { message, status } envelope into a plain list", async () => {
    mockFetch(async () =>
      jsonResponse({
        message: { hound: ["afghan", "basset"], akita: [] },
        status: "success",
      }),
    );

    const breeds = await listBreeds();

    expect(breeds).toEqual([
      { name: "hound", subBreeds: ["afghan", "basset"] },
      { name: "akita", subBreeds: [] },
    ]);
  });

  it("calls the dog.ceo endpoint", async () => {
    const fetchSpy = vi.fn(async () =>
      jsonResponse({ message: {}, status: "success" }),
    );
    vi.stubGlobal("fetch", fetchSpy);

    await listBreeds();

    expect(fetchSpy).toHaveBeenCalledWith("https://dog.ceo/api/breeds/list/all");
  });

  it("throws a ZodError when the response shape changes", async () => {
    // sub-breeds arrive as a string instead of an array
    mockFetch(async () =>
      jsonResponse({ message: { hound: "afghan" }, status: "success" }),
    );

    await expect(listBreeds()).rejects.toBeInstanceOf(z.ZodError);
  });

  it("names the offending field in the ZodError", async () => {
    mockFetch(async () =>
      jsonResponse({ message: { hound: "afghan" }, status: "success" }),
    );

    const error = await listBreeds().catch((err: unknown) => err);

    expect(error).toBeInstanceOf(z.ZodError);
    expect((error as z.ZodError).issues[0].path).toEqual(["message", "hound"]);
  });

  it("rejects a failed status envelope", async () => {
    mockFetch(async () => jsonResponse({ message: {}, status: "error" }));

    await expect(listBreeds()).rejects.toBeInstanceOf(z.ZodError);
  });

  it("throws with the status code on a non-2xx response", async () => {
    mockFetch(async () => new Response("nope", { status: 500 }));

    await expect(listBreeds()).rejects.toThrow(/500/);
  });

  it("propagates a network failure", async () => {
    mockFetch(async () => {
      throw new TypeError("Failed to fetch");
    });

    await expect(listBreeds()).rejects.toThrow(/Failed to fetch/);
  });
});

describe("breedImage", () => {
  it("returns the image url from the envelope", async () => {
    mockFetch(async () =>
      jsonResponse({
        message: "https://images.dog.ceo/breeds/hound/x.jpg",
        status: "success",
      }),
    );

    await expect(breedImage({ breed: "hound" })).resolves.toBe(
      "https://images.dog.ceo/breeds/hound/x.jpg",
    );
  });

  it("puts the breed in the url", async () => {
    const fetchSpy = vi.fn(async () =>
      jsonResponse({ message: "https://images.dog.ceo/a.jpg", status: "success" }),
    );
    vi.stubGlobal("fetch", fetchSpy);

    await breedImage({ breed: "akita" });

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://dog.ceo/api/breed/akita/images/random",
    );
  });

  it("rejects an empty breed before touching the network", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    await expect(breedImage({ breed: "" })).rejects.toBeInstanceOf(z.ZodError);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("reports the payload rule that failed", async () => {
    const error = await breedImage({ breed: "" }).catch((err: unknown) => err);

    expect((error as z.ZodError).issues[0].message).toBe("Breed is required");
  });

  it("throws when the url is not a url", async () => {
    mockFetch(async () => jsonResponse({ message: "not-a-url", status: "success" }));

    await expect(breedImage({ breed: "hound" })).rejects.toBeInstanceOf(z.ZodError);
  });
});
