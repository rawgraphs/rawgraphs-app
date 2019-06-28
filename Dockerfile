FROM node:8

RUN npm install -g bower 

WORKDIR /usr/src/app
COPY bower*.json ./

RUN bower install --allow-root

COPY . .
RUN cp js/analytics.sample.js js/analytics.js
EXPOSE 4000
CMD ["python","-m","SimpleHTTPServer","4000"] 
