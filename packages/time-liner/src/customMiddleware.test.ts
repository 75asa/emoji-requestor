import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getFileInfo,
  noThreadMessages,
  notBotMessages,
} from "./customMiddleware";

const next = vi.fn();

beforeEach(() => {
  next.mockReset();
  vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("notBotMessages", () => {
  it("passes ordinary user messages through", async () => {
    await notBotMessages({ message: { user: "U1", text: "hi" }, next });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("drops bot_message subtypes", async () => {
    await notBotMessages({ message: { subtype: "bot_message" }, next });
    expect(next).not.toHaveBeenCalled();
  });

  it("drops messages carrying a bot_id", async () => {
    await notBotMessages({ message: { bot_id: "B1", text: "hi" }, next });
    expect(next).not.toHaveBeenCalled();
  });

  it("drops hidden messages", async () => {
    await notBotMessages({ message: { hidden: true }, next });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("noThreadMessages", () => {
  it("passes top-level messages through", async () => {
    await noThreadMessages({ message: { text: "hi" }, next });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("drops thread replies", async () => {
    await noThreadMessages({ message: { thread_ts: "1.2" }, next });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("getFileInfo", () => {
  it("splits hosted images from other files", async () => {
    const context: Record<string, unknown> = {};
    const message = {
      files: [
        { id: "F1", mode: "hosted" },
        { id: "F2", mode: "snippet" },
        { id: "F3", mode: "hosted" },
      ],
    };

    await getFileInfo({ context, message, next });

    expect(context.files).toEqual({
      hosted: [
        { id: "F1", mode: "hosted" },
        { id: "F3", mode: "hosted" },
      ],
      files: [{ id: "F2", mode: "snippet" }],
    });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("leaves context untouched when there are no files", async () => {
    const context: Record<string, unknown> = {};
    await getFileInfo({ context, message: {}, next });
    expect(context.files).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
  });
});
