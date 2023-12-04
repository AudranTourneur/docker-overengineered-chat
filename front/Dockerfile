FROM node:21-alpine3.17
 
RUN npm install -g pnpm
 
WORKDIR /home/node/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
 
COPY . .
RUN npm run build
 
EXPOSE 3000
CMD ["node", "build"]
