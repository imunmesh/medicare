FROM node:22-alpine
ENV npm_config_strict_ssl=false
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
