FROM node:23.7-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci 

COPY . .
RUN npm run build && \
    rm -rf node_modules && \
    rm -rf .git && \
    rm -rf src

FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

# Create custom nginx config to use port 5173
RUN echo 'server { \
    listen 5173; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]