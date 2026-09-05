import * as dotenv from "dotenv";

dotenv.config({ path: `envs/.env.${process.env.STAGE}` });

// Object.keys(dotenv).forEach(key => {
//   process.env[key] = dotenv[key];
// });

export namespace Kibela {
  export const TEAM_NAME = process.env.KIBELA_TEAM as string;
  export const TOKEN = process.env.KIBELA_TOKEN as string;
  export const END_POINT = `https://${TEAM_NAME}.kibe.la/api/v1` as string;
  export const USER_AGENT = "emoji-syncer/1.0.0";
}

export namespace Slack {
  export const TOKEN = process.env.SLACK_BOT_TOKEN as string;
  export const SECRET = process.env.SLACK_SIGNING_SECRET as string;
  export const CHANNEL = process.env.SLACK_CHANNEL as string;
}

export namespace General {
  export const PORT = process.env.PORT as string;
}
