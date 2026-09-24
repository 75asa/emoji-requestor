# emoji-requestor

![ci](https://github.com/75asa/emoji-requestor/actions/workflows/ci.yml/badge.svg)

個人用 Slack ツール群をひとつにまとめたモノレポ。
各ツールは元リポジトリのコミット履歴ごと `git subtree` で `packages/` 配下に取り込んでいる。

## パッケージ

| パッケージ | 概要 | 元リポジトリ |
| --- | --- | --- |
| [`packages/time-liner`](packages/time-liner) | 指定 Slack チャンネルの投稿を別チャンネルへ転送する Bolt アプリ (分報 TL) | [75asa/time-liner](https://github.com/75asa/time-liner) |
| [`packages/emoji-sommelier`](packages/emoji-sommelier) | Slack に登録したカスタム絵文字を Kibela などの他サービスへ同期する | [75asa/emoji-sommelier](https://github.com/75asa/emoji-sommelier) |
| [`packages/slack-activator`](packages/slack-activator) | Slack のオンライン状態 (auto / away) を CLI・スケジュールで切り替える | [75asa/slack-activator](https://github.com/75asa/slack-activator) |

## ツールチェーン

| 役割 | ツール | 設定 |
| --- | --- | --- |
| パッケージ管理 | pnpm workspaces (corepack) | `pnpm-workspace.yaml`, `package.json#packageManager` |
| Lint / Format | [Biome](https://biomejs.dev/) | `biome.json` |
| テスト | [Vitest](https://vitest.dev/) | `vitest.config.ts` (`packages/*/src/**/*.test.ts`) |
| TypeScript | 5.x, 共通設定を各パッケージが継承 | `tsconfig.base.json` |
| Node | 20 以上 | `package.json#engines` |

## セットアップ

```sh
corepack enable
pnpm install
```

## よく使うコマンド

ルートで実行する。パッケージ単位で実行したいときは `pnpm --filter <name> <script>`。

| コマンド | 内容 |
| --- | --- |
| `pnpm lint` / `pnpm lint:fix` | Biome で lint + format チェック / 自動修正 |
| `pnpm typecheck` | 全パッケージの `tsc --noEmit` |
| `pnpm test` / `pnpm test:watch` | Vitest |
| `pnpm build` | 全パッケージの `tsc` ビルド |
| `pnpm check` | lint + typecheck + test をまとめて実行 (CI と同じ) |

各パッケージの起動:

```sh
pnpm --filter time-liner dev            # tsx watch
pnpm --filter emoji-sommelier dev       # tsx watch (STAGE=dev などを環境変数で指定)
pnpm --filter slack-activator dev:setAuto
```

環境変数や Slack App の設定手順は各パッケージの README を参照。

## CI / GitHub Actions

| ワークフロー | 内容 |
| --- | --- |
| `ci.yml` | `master` への push と全 PR で lint / typecheck / test / build |
| `slack-activator-presence.yml` | 平日 JST 10:00 に `auto`、18:00 に `away` へ Slack の状態を切り替える定期実行。`workflow_dispatch` で手動実行も可 |

`slack-activator-presence.yml` はリポジトリの Secrets に `SLACK_USER_TOKEN` (User OAuth Token) が必要。

## デプロイ

- emoji-sommelier の Docker イメージはリポジトリルートをコンテキストにしてビルドする
  (`docker build -f packages/emoji-sommelier/Dockerfile .`、`make gcr-push` も同様)。
- time-liner の Heroku デプロイは `pnpm --filter time-liner build` してから `packages/time-liner` の `Procfile` を使う。
