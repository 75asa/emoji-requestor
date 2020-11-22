import { App } from "@slack/bolt";
import { Context } from "@slack/bolt/dist/types/middleware";
import { EmojiChangedEvent } from "@slack/bolt/dist/types/events/base-events"
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