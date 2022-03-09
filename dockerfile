FROM node

WORKDIR /app
ENV NODE_ENV production

COPY . .

RUN npm install

ENTRYPOINT [ "npm", "start", "--" ]
