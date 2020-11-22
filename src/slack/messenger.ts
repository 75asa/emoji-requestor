import {
  MessengerSend,
  GenerateMessage,
  ChatPostMessageArguments,
} from "../types/messenger";
import * as constant from "../constant";

const generateOption = ({ context, event }: GenerateMessage) => {
  const isAddEvent = event.subtype === "add";
  let msgText = "";
  if (isAddEvent) {
    msgText = `新しい絵文字 :${event.name}: \`:${event.name}:\` が登録されたよ〜`;
  } else {
    const deletedNames = event.names?.map(name => {
      return `\`:${name}:\``;
    });
    msgText = `残念やけど絵文字 ${deletedNames} は削除されました。。。`;
  }
  const option: ChatPostMessageArguments = {
    token: context.botToken,
    channel: constant.Slack.CHANNEL,
    mrkdwn: true,
    text: msgText,
    blocks: [
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: msgText,
          },
        ],
      },
    ],
  };
  if (isAddEvent) {
    option.attachments = [
      {
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: " ",
            },
            accessory: {
              type: "image",
              image_url: event.value,
              alt_text: event.name,
            },
          },
        ],
      },
    ];
  }
  return option;
};

export const send = async ({ app, context, event }: MessengerSend) => {
  const option = generateOption({ event, context });
  console.log({ event });
  return await app.client.chat.postMessage(option);
};
