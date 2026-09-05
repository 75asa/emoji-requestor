import { parse } from "ts-command-line-args";
import { Config } from "./Config";
import { SlackStatus } from "./SlackStatus";

const main = async () => {
  const args = parse<Config.CLI_ARGS>({
    mode: String,
  });
  const status = new SlackStatus({
    TOKEN: process.env.SLACK_USER_TOKEN,
  });

  switch (args.mode) {
    case Config.Mode.SET_AUTO: {
      await status.setStatus("auto");
      break;
    }
    case Config.Mode.SET_AWAY: {
      await status.setStatus("away");
      break;
    }
    default:
      break;
  }
};

main();
