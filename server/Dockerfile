FROM node:22-alpine

WORKDIR /app

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

COPY package.json package-lock.json ./
COPY server/package.json server/package.json

RUN npm ci --workspace server

COPY server ./server

WORKDIR /app/server

RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
