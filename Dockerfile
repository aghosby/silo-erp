FROM node:16-alpine3.16 as build

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy silo-web package files
COPY silo-web/package*.json ./silo-web/

# Clean npm cache and install Angular CLI globally
RUN npm cache clean --force
RUN npm install -g @angular/cli@18.2.21

# Install root dependencies
RUN npm install --legacy-peer-deps

# Install silo-web dependencies
WORKDIR /app/silo-web
RUN npm install --legacy-peer-deps

# Install compiler-cli explicitly
RUN npm install --save-dev @angular/compiler-cli@18.2.21 --legacy-peer-deps

# Copy all source code
WORKDIR /app
COPY . .

# Build the Angular app from silo-web directory
WORKDIR /app/silo-web
RUN ng build --configuration production

# Production stage
FROM nginx:1.23.0-alpine

# Use Cloud Run's preferred port (8080) but make it configurable
ENV PORT=8080
EXPOSE 8080

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built Angular app (note: outputPath in angular.json is dist/silo)
COPY --from=build /app/silo-web/dist/silo /usr/share/nginx/html

# Add a healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/healthz || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
