#Make node_modules
FROM node:14-alpine AS node_modules
COPY ["*.json", "*.lock", "./"]
RUN npm install --production=true

#Make run image
FROM node:14-alpine
ARG PORT=3000
WORKDIR /app
COPY ./server /app/
COPY --from=node_modules node_modules /app/node_modules
EXPOSE $PORT

CMD [ "node", "monitor.mjs" ]