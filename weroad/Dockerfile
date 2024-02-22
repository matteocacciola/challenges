FROM node:18-alpine as api_development

RUN mkdir app
WORKDIR /app

COPY package*.json ./
RUN npm ci --development

COPY . .
RUN rm -rf ./app/frontend
RUN npm run build


FROM api_development as api_production

ENV PORT=3000
ENV ENV=prod

RUN npm ci --production
COPY --chown=$USER:$USER --from=api_development /app/dist ./dist
RUN npm run typeorm:migration:migrate

EXPOSE ${PORT}

CMD ["npm", "run", "start:prod"]


FROM node:lts-alpine as client_development

RUN mkdir app

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
RUN npm install vite -g

COPY ./frontend/package.json /app/package.json
COPY ./frontend/package-lock.json /app/package-lock.json
COPY ./frontend /app

RUN npm install
RUN npm run build


FROM client_development as client_production

ENV PORT=8080
ENV ENV=prod

RUN npm ci --production
COPY --chown=$USER:$USER --from=client_development /app/dist ./dist

EXPOSE ${PORT}

CMD ["npm", "run", "prod"]