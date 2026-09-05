# emoji-requestor

![time-liner](https://github.com/75asa/emoji-requestor/actions/workflows/time-liner.yml/badge.svg)
![emoji-sommelier](https://github.com/75asa/emoji-requestor/actions/workflows/emoji-sommelier.yml/badge.svg)
![slack-activator](https://github.com/75asa/emoji-requestor/actions/workflows/slack-activator.yml/badge.svg)

個人用 Slack ツール群をひとつにまとめたモノレポ。
各ツールは元リポジトリのコミット履歴ごと `git subtree` で `packages/` 配下に取り込んでいる。

## パッケージ

| パッケージ | 概要 | 元リポジトリ | Node / パッケージマネージャ |
| --- | --- | --- | --- |
| [`packages/time-liner`](packages/time-liner) | 指定 Slack チャンネルの投稿を別チャンネルへ転送する Bolt アプリ (分報 TL) | [75asa/time-liner](https://github.com/75asa/time-liner) | 12.x / yarn 1 |
| [`packages/emoji-sommelier`](packages/emoji-sommelier) | Slack に登録したカスタム絵文字を Kibela などの他サービスへ同期する | [75asa/emoji-sommelier](https://github.com/75asa/emoji-sommelier) | 12.x / yarn 1 |
| [`packages/slack-activator`](packages/slack-activator) | Slack のオンライン状態 (auto / away) を CLI・スケジュールで切り替える | [75asa/slack-activator](https://github.com/75asa/slack-activator) | 18+ / yarn 3 (corepack) |

各パッケージは独立して動作する。ルートに workspace 設定は置いていないので、
それぞれのディレクトリに入って `yarn` を実行する。

```sh
cd packages/time-liner && yarn && yarn dev
cd packages/emoji-sommelier && yarn && yarn build:live
cd packages/slack-activator && corepack enable && yarn && yarn dev:setAuto
```

環境変数や Slack App の設定手順は各パッケージの README を参照。

## CI / GitHub Actions

ワークフローはすべてリポジトリ直下の `.github/workflows/` に置き、
`paths` フィルタで変更のあったパッケージだけを実行する。

| ワークフロー | 内容 |
| --- | --- |
| `time-liner.yml` | lint + tsc |
| `emoji-sommelier.yml` | tsc |
| `slack-activator.yml` | lint + tsc |
| `slack-activator-presence.yml` | 平日 JST 10:00 に `auto`、18:00 に `away` へ Slack の状態を切り替える定期実行。`workflow_dispatch` で手動実行も可 |

`slack-activator-presence.yml` はリポジトリの Secrets に `SLACK_USER_TOKEN` (User OAuth Token) が必要。
