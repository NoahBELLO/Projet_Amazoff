# FROM node:alpine

# WORKDIR /usr/src/app

# EXPOSE 5003

# COPY package*.json ./

# COPY . .
FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5003
CMD ["sh", "./install.sh"]