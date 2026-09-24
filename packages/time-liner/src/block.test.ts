import { describe, expect, it } from "vitest";
import { dealBlock } from "./block";
import type { MessageEventParam } from "./bolt.interface";

const image = (name: string) => ({
  name,
  mode: "hosted",
  url_private: `https://files.slack.com/${name}`,
});

const build = (overrides: Partial<Record<string, unknown>> = {}) =>
  ({
    context: { channel: { name: "times_me" }, ...overrides },
    message: { text: "hello", files: [] },
  }) as unknown as MessageEventParam;

describe("dealBlock", () => {
  it("returns header, divider and the message section", async () => {
    const blocks = await dealBlock(build());

    expect(blocks.map((b) => b.type)).toEqual([
      "context",
      "divider",
      "section",
    ]);
    expect(JSON.stringify(blocks[0])).toContain("#times_me");
    expect(blocks[2]).toMatchObject({
      text: { type: "mrkdwn", text: "hello" },
    });
  });

  it("uses a blank text when the message has none", async () => {
    const params = build();
    params.message.text = undefined;

    const blocks = await dealBlock(params);

    expect(blocks[2]).toMatchObject({ text: { text: " " } });
  });

  it("attaches a single hosted image as the section accessory", async () => {
    const params = build({ files: { hosted: [image("a.png")], files: [] } });
    params.message.files = [image("a.png")] as never;

    const blocks = await dealBlock(params);

    expect(blocks).toHaveLength(3);
    expect(blocks[2]).toMatchObject({
      accessory: {
        type: "image",
        image_url: "https://files.slack.com/a.png",
        alt_text: "a.png",
      },
    });
  });

  it("appends one section per image when several are hosted", async () => {
    const files = [image("a.png"), image("b.png")];
    const params = build({ files: { hosted: files, files: [] } });
    params.message.files = files as never;

    const blocks = await dealBlock(params);

    expect(blocks).toHaveLength(5);
    expect(blocks[2]).not.toHaveProperty("accessory");
    expect(blocks[3]).toMatchObject({
      accessory: { image_url: "https://files.slack.com/a.png" },
    });
    expect(blocks[4]).toMatchObject({
      accessory: { image_url: "https://files.slack.com/b.png" },
    });
  });
});
