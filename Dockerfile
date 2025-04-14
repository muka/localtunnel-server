FROM node:22 AS build

WORKDIR /app

COPY package.json /app/
COPY package.lock /app/

RUN npm install --production

COPY ./src /app/src
COPY ./bin /app/bin
COPY ./tsconfig.json /app

RUN npm run build

FROM node:22

COPY --from=build /app /app

ENV NODE_ENV=production
ENTRYPOINT ["node", "./bin/server"]
