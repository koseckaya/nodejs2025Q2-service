FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src/ ./src/
COPY doc/ ./src/doc/
COPY typeorm.config.ts ./
COPY tsconfig.json ./
COPY docker-entrypoint.sh ./

RUN npm run build

RUN mkdir -p dist/doc && cp src/doc/api.yaml dist/doc/

RUN npm ci --only=production

RUN mkdir -p logs && chmod -R 777 logs

RUN chmod +x docker-entrypoint.sh

EXPOSE ${PORT}

ENTRYPOINT ["./docker-entrypoint.sh"]