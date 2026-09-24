import type { App, Context } from "@slack/bolt";
import type { EmojiChangedEvent } from "@slack/types";

export { ChatPostMessageArguments } from "@slack/web-api";

export interface MessengerSend {
  app: App;
  context: Context;
  event: EmojiChangedEvent;
}

export interface GenerateMessage {
  context: Context;
  event: EmojiChangedEvent;
}
