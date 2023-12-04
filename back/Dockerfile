FROM node:21-alpine3.17
WORKDIR /home/node/app
ENV USER=node
COPY --chown=node package.json package-lock.json ./
RUN npm install
COPY --chown=node src ./src
COPY --chown=node esbuild.js ./
COPY --chown=node .env ./
RUN npm run build
CMD ["npm", "run", "start"]
