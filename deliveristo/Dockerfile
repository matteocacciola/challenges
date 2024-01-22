FROM node:20.11-alpine

RUN mkdir app
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build

# Run Apollo Server
CMD ["npm", "run", "dev"]
