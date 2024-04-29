from node:18
WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y git

# Remove unused downloaded list
RUN rm -rf /var/lib/apt/lists/*

# add workdir as safe directory for running husky
RUN git config --global --add safe.directory /usr/src/app

COPY ./package.json ./yarn.lock ./

RUN yarn

EXPOSE 9090

CMD ["yarn", "dev"]
