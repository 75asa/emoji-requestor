# Build from the repository root:
#   docker build -f packages/emoji-sommelier/Dockerfile --build-arg STAGE=dev .
FROM node:20-slim

RUN corepack enable

WORKDIR /repo
ARG STAGE
ENV STAGE=${STAGE}

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/emoji-sommelier/package.json packages/emoji-sommelier/
RUN pnpm install --frozen-lockfile --filter emoji-sommelier...

COPY packages/emoji-sommelier packages/emoji-sommelier
RUN pnpm --filter emoji-sommelier build

WORKDIR /repo/packages/emoji-sommelier
CMD ["node", "dest/index.js"]
