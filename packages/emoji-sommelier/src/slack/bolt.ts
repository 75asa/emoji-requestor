import { App, LogLevel, ExpressReceiver } from "@slack/bolt";
import * as constant from "../constant";

console.log({ constant });

import * as dotenv from "dotenv";
dotenv.config({ path: `envs/.env.${process.env.STAGE}` });

export const receiver = new ExpressReceiver({
  signingSecret: constant.Slack.SECRET,
});

const config = {
  logLevel: LogLevel.DEBUG,
  token: constant.Slack.TOKEN,
  signingSecret: constant.Slack.SECRET,
  receiver,
};

export const app = new App(config);
