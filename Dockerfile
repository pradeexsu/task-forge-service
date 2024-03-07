FROM node:16-alpine

RUN mkdir /code
WORKDIR /code

COPY package*.json  ./
COPY prisma/schema.prisma ./
COPY .env ./

RUN npm i
RUN npx prisma generate
COPY . .
RUN npm run build


EXPOSE 3001
RUN rm -rf src tsconfig.json

CMD [ "node", "dist/index.js" ]
