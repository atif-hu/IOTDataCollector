# Use Node.js 18 instead of 16
FROM node:18 AS build

WORKDIR /app

COPY ./frontend/package.json ./frontend/yarn.lock ./

RUN yarn install

COPY ./frontend/ ./

RUN yarn build

# Serve the production build
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
