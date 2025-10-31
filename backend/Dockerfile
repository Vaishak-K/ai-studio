FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install Python and build tools for better-sqlite3 in production
RUN apk add --no-cache python3 make g++

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy SQL schema file
COPY --from=builder /app/src/models/schema.sql ./src/models/

# Create necessary directories
RUN mkdir -p /app/data /app/uploads

EXPOSE 3001

CMD ["node", "dist/index.js"]