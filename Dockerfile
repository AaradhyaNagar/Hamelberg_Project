FROM node:22

WORKDIR /app

COPY package*.json ./

# Set NODE_ENV inside the container
ENV NODE_ENV=production

# Install only production dependencies (skips devDependencies)
RUN npm install

COPY . .

EXPOSE 800 

CMD ["node", "index.js"]