FROM node:lts-alpine as builder

# Set the working directory inside the container
WORKDIR /app
COPY package*.json tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy the entire project to the working directory
COPY ./src ./src

## Build the app
RUN npm run build

FROM node:lts-alpine

RUN adduser -D ml-user
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

## Copy of dist directory from builder
COPY --from=builder /app/dist/ ./dist/

# Set the NODE_ENV environment variable
ENV NODE_ENV=production
USER ml-user

CMD ["node", "dist/src/index.js"]
