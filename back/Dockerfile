ARG NODE_IMAGE=node:21-alpine

FROM $NODE_IMAGE AS base
RUN apk --no-cache add dumb-init
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node
RUN mkdir tmp

COPY --chown=node:node ./package*.json ./
RUN npm install
COPY --chown=node:node . .

ENV NODE_ENV=production
RUN echo test
RUN npm run build
WORKDIR /home/node/app/build
COPY --chown=node:node .env .
#ENV PORT=3500
#ENV HOST=0.0.0.0
#ENV APP_KEY=admin123
EXPOSE 3500
CMD [ "node", "server.js" ]
