FROM node:12-slim

WORKDIR /app
ARG STAGE
ENV STAGE=${STAGE}
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
COPY tsconfig.json /app/tsconfig.json
COPY envs/.env.$STAGE /app/envs/.env.$STAGE
COPY src/ /app/src

RUN mkdir dest/ && yarn && yarn build
CMD ["yarn", "start"]
