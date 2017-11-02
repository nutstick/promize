FROM node:8.4.0

# Install yarn
# RUN curl -o- -L https://yarnpkg.com/install.sh | bash
RUN npm install -g yarn

RUN mkdir -p /app

WORKDIR /app

ADD package.json .
RUN yarn install --quiet

RUN npm install typescript --global

ADD . .

EXPOSE 3000

CMD [ "yarn", "start" ]