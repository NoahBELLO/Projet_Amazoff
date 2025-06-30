# FROM node:alpine

# WORKDIR /usr/src/app

# EXPOSE 5001

# COPY package*.json ./

# COPY . .

FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5001
CMD ["sh", "./install.sh"]