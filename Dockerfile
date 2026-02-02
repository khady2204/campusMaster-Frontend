# Dockerfile simple pour Next.js
FROM node:20-alpine
WORKDIR /app

# Copier les fichiers de dépendances et installer
COPY package.json ./
COPY package-lock.json* ./
RUN npm install

# Copier tout le code
COPY . .

# Build l'application
RUN npm run build

# Exposer le port par défaut de Next.js
EXPOSE 3000

# Lancer l'application en production
CMD ["npm", "start"]
