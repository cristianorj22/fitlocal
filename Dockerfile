FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 5173

# Vite precisa ouvir em todas as interfaces para acessar de fora do container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
