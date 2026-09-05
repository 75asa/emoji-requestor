import fetch from "node-fetch";
import { print as printGql } from "graphql/language/printer";
import * as query from "./query";
import * as constant from "../constant";

export const getEmoji = async () => {
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
    }),
  })
    .then(response => {
      console.info("query success");
    })
    .catch(e => console.error(`fetch request error: ${e}`));
};
