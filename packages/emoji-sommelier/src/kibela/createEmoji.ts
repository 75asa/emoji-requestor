import fetch from "node-fetch";
import { print as printGql } from "graphql/language/printer";
import * as query from "./query";
import * as constant from "../constant";
const imageDataURI = require("image-data-uri");

const rename = (codeName: string) => {
  let result = "";
  // kibela の絵文字は `-` が使えないため変換
  const regex1 = /-/g;
  // 日本語は削除
  const regex2 = /[^0-9a-z_]+/g;
  result = codeName.replace(regex1, "_");
  result = codeName.replace(regex2, "");
  return result;
};

export const createEmoji = async (code: string, imageUrl: string) => {
  return imageDataURI.encodeFromURL(imageUrl).then((datauri: string) => {
    const renemedCode = rename(code);
    return fetch(constant.Kibela.END_POINT, {
      method: "POST",
      redirect: "follow",
      headers: {
        Authorization: `Bearer ${constant.Kibela.TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": constant.Kibela.TOKEN,
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
  });
};
