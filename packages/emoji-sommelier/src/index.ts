import * as slack from "./slack";
import * as handler from "./handler";
import * as constant from "./constant";

const app = slack.bolt.app;

app.command("/ping", async ({ command, payload, ack, say }) => {
  console.log({ command, payload });
  // コマンドリクエストを確認
  await ack();
  await say(`pong !!`)
    .then(res => {
      console.log({ res });
    })
    .catch(err => {
      console.log({ err });
    });
});

app.command("/sync-emoji", async ({ command, ack, say }) => {
  console.log(command);
  // コマンドリクエストを確認
  await ack();
  say("sync start !!");
  const result = await handler.syncEmoji(app);
  await say(`sync done !! ${result}`)
    .then(res => {
      console.log({ res });
    })
    .catch(err => {
      console.log({ err });
    });
});

slack.bolt.receiver.app.get("sync-emoji", (req, res) => {
  res.sendStatus(200);
  handler.syncEmoji(app);
});

handler.catchEmojiEvent(app);

(async () => {
  // Start your app
  await app.start(constant.General.PORT);

  console.log("⚡️ Bolt app is running!");
})();
