FROM node:20

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all files
COPY . .

# Expose the standard Vite port
EXPOSE 5173

# Run the dev server and expose it to the host network
CMD ["npm", "run", "dev", "--", "--host"]
