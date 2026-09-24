import type { Context } from "@slack/bolt";
import type { EmojiChangedEvent } from "@slack/types";
import { beforeAll, describe, expect, it, vi } from "vitest";

type Messenger = typeof import("./messenger");

let generateOption: Messenger["generateOption"];

beforeAll(async () => {
  vi.stubEnv("SLACK_CHANNEL", "C0EMOJI");
  ({ generateOption } = await import("./messenger"));
});

const context = { botToken: "xoxb-test" } as Context;

describe("generateOption", () => {
  it("builds an add message with an image attachment", () => {
    const event = {
      type: "emoji_changed",
      subtype: "add",
      name: "parrot",
      value: "https://emoji.slack-edge.com/parrot.gif",
      event_ts: "1",
    } as EmojiChangedEvent;

    const option = generateOption({ context, event });

    expect(option.channel).toBe("C0EMOJI");
    expect(option.token).toBe("xoxb-test");
    expect(option.text).toContain(":parrot:");
    expect(option).toHaveProperty("attachments");
    const attachments = (option as { attachments: unknown[] }).attachments;
    expect(attachments).toHaveLength(1);
    expect(JSON.stringify(attachments)).toContain(
      "https://emoji.slack-edge.com/parrot.gif",
    );
  });

  it("builds a remove message listing every deleted emoji", () => {
    const event = {
      type: "emoji_changed",
      subtype: "remove",
      names: ["old", "older"],
      event_ts: "1",
    } as EmojiChangedEvent;

    const option = generateOption({ context, event });

    expect(option.text).toContain("`:old:`");
    expect(option.text).toContain("`:older:`");
    expect(option).not.toHaveProperty("attachments");
  });
});
