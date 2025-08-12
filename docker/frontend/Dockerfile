# Этап сборки
FROM node:22-alpine AS builder

WORKDIR /build

RUN npm install -g npm@latest

COPY frontend/package*.json ./

RUN npm install --no-audit --no-fund && npm cache clean --force

FROM node:22-alpine

RUN apk add --no-cache --virtual .build-deps tini curl \
    && apk add --no-cache su-exec

RUN npm install -g npm@latest

WORKDIR /var/www/frontend
RUN mkdir -p /var/www/frontend && \
    chown -R node:node /var/www/frontend

COPY --from=builder --chown=node:node /build/node_modules ./node_modules
COPY --chown=node:node frontend/package*.json ./

# Entrypoint для подготовки прав и кешей
COPY docker/frontend/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Запускаем entrypoint от root, чтобы он мог чинить права; далее он понижает привилегии до node через su-exec
USER root

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:5173 || exit 1

ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/entrypoint.sh"]

CMD ["npm", "run", "dev"]