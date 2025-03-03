FROM node:latest
RUN mkdir -p /code
WORKDIR /code
RUN addgroup --system appgroup && adduser --system app && adduser app appgroup
COPY package*.json /code/
RUN npm install
COPY ./ /code/
RUN chown -R app:appgroup /code
USER app
EXPOSE 3000
