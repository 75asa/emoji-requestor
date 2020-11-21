import { App } from "@slack/bolt";
import * as dotenv from "dotenv";
dotenv.config({ path: `envs/.env.${process.env.STAGE}` });

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.command("/ping", async ({ command, ack, say, respond }) => {
  console.log(command);

  // コマンドリクエストを確認
  await ack();
  await say(`pong`)
    .then(res => {
      console.log({ res });
    })
    .catch(err => {
      console.log({ err });
    });
});

(async () => {
  // Start your app
  await app.start(process.env.APP_LISTEN_PORT);

  console.log("⚡️ Bolt app is running!");
})();
