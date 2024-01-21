# syntax=docker/dockerfile:1
FROM node:12-alpine

# Définit le répertoire de travail
WORKDIR /app

# Copie le fichier package.json et le fichier package-lock.json (si présent)
COPY package*.json ./

# Installe les dépendances (y compris les dépendances de développement)
RUN npm install

# Copie le reste des fichiers de l'application
COPY . .


# Commande par défaut à exécuter lors du démarrage du conteneur
CMD ["node", "src_race.js"]