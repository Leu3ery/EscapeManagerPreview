FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN apk add --no-cache python3 make g++
RUN npm ci --omit=dev
COPY backend/ ./

FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

RUN apk add --no-cache nginx bash

COPY --from=backend-build /app/backend /app/backend
RUN mkdir -p /app/backend/data

COPY --from=frontend-build /app/frontend/dist/quest_admin_panel/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 80
CMD ["/app/start.sh"]
