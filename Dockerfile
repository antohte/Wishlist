FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=80 HOST=0.0.0.0 STORAGE_MODE=local DATA_DIR=/app/.data
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY server ./server
COPY src/data/wishlist.ts ./src/data/wishlist.ts
COPY scripts/serve.mjs ./scripts/serve.mjs
EXPOSE 80
CMD ["node", "scripts/serve.mjs"]
