FROM node:22-alpine as builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Build the application
ENV NODE_PATH=/app
RUN echo "Building the application..." && \
  ls -la && \
  npm run build && \
  echo "Build completed. Contents of /app/dist:" && \
  ls -la dist/ && \
  echo "Contents of /app/dist/src:" && \
  ls -la dist/src/

FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache netcat-openbsd postgresql-client

# Copy only necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/typeorm.config.ts ./
COPY --from=builder /app/node_modules ./node_modules
COPY doc/api.yaml ./dist/doc/api.yaml

# Copy scripts
COPY wait-for-it.sh docker-entrypoint.sh ./
RUN chmod +x wait-for-it.sh docker-entrypoint.sh && \
  echo "Final contents of /app:" && \
  ls -la && \
  echo "Final contents of /app/dist:" && \
  ls -la dist/ && \
  echo "Final contents of /app/dist/src:" && \
  ls -la dist/src/

RUN mkdir -p logs

EXPOSE 4000

ENTRYPOINT ["./docker-entrypoint.sh"]