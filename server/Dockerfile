# Dockerfile satisfies: Containerization with Docker, Backend deployment, Environment variables & secrets management

# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Environment variables & secrets management (build time)
ENV NODE_ENV=production

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY . .

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
