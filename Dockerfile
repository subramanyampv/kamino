FROM node:alpine
EXPOSE 3000
RUN mkdir /app
WORKDIR /app
ADD package.json /app
ADD package-lock.json /app
RUN npm install --only=production
ADD . /app
CMD ["node", "index.js"]
