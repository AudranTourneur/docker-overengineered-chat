FROM node:21
WORKDIR /home/node/app
ENV USER=node
COPY --chown=node package.json package-lock.json .
RUN npm install
COPY --chown=node src ./src
RUN npm run build
CMD ["npm", "run", "start"]
