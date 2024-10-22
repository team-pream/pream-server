FROM node:20.17.0-alpine AS builder

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:20.17.0-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/prisma ./prisma 

EXPOSE 8000

CMD ["node", "dist/src/main.js"]
