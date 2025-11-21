# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files from backend
COPY backend/package*.json ./

# Install dependencies
RUN npm install --production

# Copy backend application files
COPY backend/ ./

# Expose port (Railway will set PORT env variable)
EXPOSE 3001

# Start the application
CMD ["npm", "start"]

