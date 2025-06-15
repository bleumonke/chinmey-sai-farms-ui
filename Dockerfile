# Stage 1: Build React app
FROM node:20-alpine AS build

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
FROM node:20-alpine AS production

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
