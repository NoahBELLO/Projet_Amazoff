# FROM node:18

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 6003

# CMD ["npm", "start"]

FROM node:alpine

WORKDIR /usr/src/app

EXPOSE 7002

COPY package*.json ./

COPY . .