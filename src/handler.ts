import * as kibela from "./kibela";
import * as slack from "./slack";
import { App } from "@slack/bolt";

export const syncEmoji = async (app: App) => {
  const result = await app.client.emoji
    .list({
      token: process.env.SLACK_BOT_TOKEN,
    })
    .then(res => {
      if (!res.ok) console.error(`err!\n${res}`);
      console.info({ res });
      return res;
    })
    .catch(err => {
      console.error({ err });
      return err;
    });
  if (result.ok) {
    console.log("Start emoji sync");
    // TODO: kibela の絵文字の最後は何かみる
    for (const code in result.emoji) {
      await kibela
        .createEmoji(code, result.emoji[code])
        .catch(e => console.error(`CreateEmoji Error: ${e}`));
    }
    return `OK! imported ${Object.keys(result.emoji).length} emojis`;
  } else {
    return result.error;
  }
};

export const catchEmojiEvent = async (app: App) => {
  app.event("emoji_changed", async ({ event, context }) => {
    slack.messenger
      .send({ app, context, event })
      .then(res => {
        console.info({ res });
      })
      .catch(err => {
        console.error({ err });
      });
  });
};
