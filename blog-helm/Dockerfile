FROM node:10-alpine
EXPOSE 3000
RUN mkdir /app
WORKDIR /app
COPY package*.json /app/
RUN npm install --only=production
COPY index.js /app
CMD ["node", "index.js"]
ENV APP_ENV=
