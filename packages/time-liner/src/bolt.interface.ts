import type { Context, NextFn } from "@slack/bolt";
import type { GenericMessageEvent } from "@slack/types";

// hidden は message_changed 等のサブタイプで付く隠しフラグ
export type TimelineMessage = GenericMessageEvent & { hidden?: boolean };

import type { WebClient } from "@slack/web-api";

export interface MessageEventParam {
  message: TimelineMessage;
  context: Context;
  client?: WebClient;
}

export interface MiddlewareParam {
  next: NextFn;
  client?: WebClient;
  message?: TimelineMessage;
  context?: Context;
}
