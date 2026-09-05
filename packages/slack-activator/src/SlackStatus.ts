import { WebClient } from "@slack/web-api";
import { Config } from "./Config";
export class SlackStatus {
  #client;
  constructor({ TOKEN }: typeof Config.Slack.env) {
    if (!TOKEN) throw new Error("Slack User token not found");
    this.#client = new WebClient(TOKEN);
  }

  async setStatus(status: Config.Slack.Status) {
    try {
      const result = await this.#client.users.setPresence({
        presence: status,
      });
      console.dir({ result }, { depth: null });
      if (!result.ok) throw new Error(result.error);
    } catch (e) {
      if (e instanceof Error) throw e;
    }
  }
}
