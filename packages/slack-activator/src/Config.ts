import dotenv from "dotenv";

dotenv.config().parsed;

export namespace Config {
  export const Mode = {
    SET_AWAY: "away",
    SET_AUTO: "auto",
  } as const;
  export interface CLI_ARGS {
    mode: string;
  }
  export namespace Slack {
    export type Status = "away" | "auto";
    export const env = {
      TOKEN: process.env.SLACK_USER_TOKEN,
    } as const;
  }
}
