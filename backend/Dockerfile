FROM node:20

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependecies
RUN npm install

# Copy all files
COPY . .

# Expose the standard backend port
EXPOSE 4000

# Start server in dev mode
CMD ["npm", "run", "dev"]
