FROM node:22-alpine

WORKDIR /app

# Copy package*.json trước để tận dụng cache layer khi chỉ sửa code
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000
USER node

CMD ["node", "server.js"]
