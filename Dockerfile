FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json /app/tsconfig*.json ./
COPY --from=builder /app/server.ts ./
RUN npm ci --production

EXPOSE 3000
CMD ["npx", "tsx", "server.ts"]