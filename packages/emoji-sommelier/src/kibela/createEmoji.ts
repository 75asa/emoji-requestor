import fetch from "node-fetch";
import { print as printGql } from "graphql/language/printer";
import * as query from "./query";
import * as constant from "../constant";

const rename = (codeName: string) => {
  let result = "";
  // kibela の絵文字は `-` が使えないため変換
  const regex1 = /-/g;
  // 日本語は削除
  const regex2 = /[^0-9a-z_]+/g;
  result = codeName.replace(regex1, "_").replace(regex2, "");
  return result;
};

// 画像 URL を取得して data URI (base64) に変換する
const encodeImageFromURL = async (imageUrl: string): Promise<string> => {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`failed to fetch image: ${response.status} ${imageUrl}`);
  }
  const contentType =
    response.headers.get("content-type")?.split(";")[0] || "image/png";
  const buffer = await response.buffer();
  return `data:${contentType};base64,${buffer.toString("base64")}`;
};

export const createEmoji = async (code: string, imageUrl: string) => {
  const datauri = await encodeImageFromURL(imageUrl);
  const renemedCode = rename(code);
  return fetch(constant.Kibela.END_POINT, {
    method: "POST",
    redirect: "follow",
    headers: {
      Authorization: `Bearer ${constant.Kibela.TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": constant.Kibela.USER_AGENT,
    },
    body: JSON.stringify({
      query: printGql(query.emojiMutation),
      variables: {
        code: renemedCode,
        url: datauri,
      },
    }),
  })
    .then(response => {
      console.info(
        `create request ${code}, renamed => ${renemedCode}: ${JSON.stringify(
          response
        )}`
      );
    })
    .catch(e => console.error(`fetch request error: ${e}`));
};
