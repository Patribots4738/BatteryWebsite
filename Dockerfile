FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

ARG PORT=4738

ENV HOST=0.0.0.0
ENV PORT=$PORT

EXPOSE $PORT

CMD ["pnpm", "run", "start"]

