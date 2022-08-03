# Docker container built on Ubuntu 16.04 that hosts the RAWGraphs visualization
# application on a python simpleHTTP web server on port 4000.
FROM node:14-alpine
LABEL description="Implements a rawgraphs.io server. Execute using: \
    docker run -d -p 43000:3000 dawmatt/rawgraphs:1.0.0" 

ENV NODE_ENV=production

# Install required utilities
RUN apk add --update git

# Add Rawgraph code, dependencies and install
RUN mkdir /src/ && \
    git clone https://github.com/rawgraphs/rawgraphs-app.git /src/rawgraphs-app
WORKDIR /src/rawgraphs-app
RUN yarn add node-sass@4.14.1 && \
    yarn install && \
    npx browserslist@latest --update-db

# add `/app/node_modules/.bin` to $PATH
ENV PATH /src/rawgraphs-app/node_modules/.bin:$PATH

# Start the server
CMD ["yarn", "start"] 

# FROM node:14-alpine
# ~887 Mb
# FROM node:14-slim
# 1.05Gb

# docker build -f Dockerfile --tag rawgraphs-app .
# docker images
#
# docker run -p 43000:3000 rawgraphs-app
