# definition of server
FROM node:14
WORKDIR /app/
COPY ./ ./
RUN npm install
RUN npm run build_in_docker
EXPOSE 8080
CMD [ "node", "/app/dist/server.js" ]
