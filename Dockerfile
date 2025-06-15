# Stage 1: Build React app
FROM node:18.17-alpine AS build

# Set working directory
WORKDIR /app

# Install build dependencies for Alpine
RUN apk add --no-cache bash git python3 make g++

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve built app with lightweight server
FROM node:18.17-alpine AS production

WORKDIR /app

# Install serve globally to serve static files
RUN npm install -g serve

# Copy build output from previous stage
COPY --from=build /app/build ./build

# Expose port (Railway will pick this automatically or you can specify)
EXPOSE 3000

# Start the server to serve static files from build folder
CMD ["serve", "-s", "build", "-l", "3000"]
