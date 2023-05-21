FROM node:14-alpine

EXPOSE 3000

# this counts on the rawgraphs repository directory being mounted in /app,
# as done by docker-compose.yml

WORKDIR /app

ENTRYPOINT yarn install && yarn start --host 0.0.0.0
