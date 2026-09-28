FROM node:22.15.1-alpine AS builder

WORKDIR /usr/app

COPY package*.json ./

#RUN npm install
# Для воспроизводимости и чистоты
RUN npm ci --only=production

COPY . /usr/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm run build

FROM node:22.15.1-alpine

WORKDIR /usr/app

COPY --from=builder /usr/app/package*.json .

COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/dist ./dist
#COPY --from=builder /usr/app/.env ./
ENV HTTP_PORT=3000

EXPOSE ${HTTP_PORT}

CMD [ "node", "dist/src/main" ]