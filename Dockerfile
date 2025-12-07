FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && \
  npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/doc/api.yaml ./dist/doc/api.yaml
COPY docker-entrypoint.sh .

RUN mkdir -p logs && chmod -R 777 logs && \
  chmod +x docker-entrypoint.sh

EXPOSE ${PORT}

ENTRYPOINT ["./docker-entrypoint.sh"]