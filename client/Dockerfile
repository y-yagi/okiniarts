FROM node:8.11.3

RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn

COPY src /usr/src/app
