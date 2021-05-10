FROM node:14-alpine AS build
RUN apk add util-linux
#Build
WORKDIR /app

COPY ["*.json", "*.lock", "./"]
RUN npm i
COPY client ./client
RUN npm run build_x

# #Make run image
FROM nginx:stable-alpine
ARG PORT=80
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE $PORT