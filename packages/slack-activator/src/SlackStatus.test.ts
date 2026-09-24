import { beforeEach, describe, expect, it, vi } from "vitest";

const setPresence = vi.fn();

vi.mock("@slack/web-api", () => ({
  // arrow functions are not constructible, so use a plain function here
  WebClient: vi.fn(function WebClientMock() {
    return { users: { setPresence } };
  }),
}));

import { WebClient } from "@slack/web-api";
import { SlackStatus } from "./SlackStatus";

beforeEach(() => {
  setPresence.mockReset();
  vi.mocked(WebClient).mockClear();
  vi.spyOn(console, "dir").mockImplementation(() => {});
});

describe("SlackStatus", () => {
  it("refuses to start without a token", () => {
    expect(() => new SlackStatus({ TOKEN: undefined })).toThrow(
      "Slack User token not found",
    );
  });

  it("creates a WebClient with the given token", () => {
    new SlackStatus({ TOKEN: "xoxp-test" });
    expect(WebClient).toHaveBeenCalledWith("xoxp-test");
  });

  it("sets the requested presence", async () => {
    setPresence.mockResolvedValue({ ok: true });

    await new SlackStatus({ TOKEN: "xoxp-test" }).setStatus("away");

    expect(setPresence).toHaveBeenCalledWith({ presence: "away" });
  });

  it("surfaces Slack API errors", async () => {
    setPresence.mockResolvedValue({ ok: false, error: "invalid_auth" });

    await expect(
      new SlackStatus({ TOKEN: "xoxp-test" }).setStatus("auto"),
    ).rejects.toThrow("invalid_auth");
  });
});
