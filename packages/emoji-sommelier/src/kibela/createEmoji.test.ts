import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("node-fetch", () => ({ default: vi.fn() }));

import fetch from "node-fetch";
import { encodeImageFromURL, rename } from "./createEmoji";

const mockedFetch = vi.mocked(fetch);

describe("rename", () => {
  it("replaces hyphens with underscores", () => {
    expect(rename("party-parrot")).toBe("party_parrot");
  });

  it("strips characters kibela does not accept", () => {
    expect(rename("おめでとう-2024")).toBe("_2024");
    expect(rename("Smile!")).toBe("mile");
  });

  it("keeps already valid codes untouched", () => {
    expect(rename("thumbs_up")).toBe("thumbs_up");
  });
});

describe("encodeImageFromURL", () => {
  beforeEach(() => {
    mockedFetch.mockReset();
  });

  it("returns a base64 data URI using the response content type", async () => {
    const body = Buffer.from("png-bytes");
    mockedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => "image/png; charset=binary" },
      buffer: async () => body,
    } as never);

    const result = await encodeImageFromURL("https://example.com/a.png");

    expect(mockedFetch).toHaveBeenCalledWith("https://example.com/a.png");
    expect(result).toBe(`data:image/png;base64,${body.toString("base64")}`);
  });

  it("falls back to image/png when content type is missing", async () => {
    mockedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => null },
      buffer: async () => Buffer.from("x"),
    } as never);

    await expect(encodeImageFromURL("https://example.com/x")).resolves.toMatch(
      /^data:image\/png;base64,/,
    );
  });

  it("throws when the image cannot be fetched", async () => {
    mockedFetch.mockResolvedValue({
      ok: false,
      status: 404,
      headers: { get: () => null },
      buffer: async () => Buffer.from(""),
    } as never);

    await expect(
      encodeImageFromURL("https://example.com/missing.png"),
    ).rejects.toThrow("failed to fetch image: 404");
  });
});
