FROM node:18-alpine

WORKDIR /app

COPY . .

# Force remove node_modules if they were copied (safety net)
RUN rm -rf node_modules

# Install dependencies inside the container
RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]
