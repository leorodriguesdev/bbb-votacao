# Use uma imagem oficial do Node
FROM node:14

# Crie o diretório da app no container
WORKDIR /usr/src/app

# Copie os arquivos de package e package-lock
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todos os arquivos da app
COPY . .

# Exponha a porta que sua app usa (suponho que seja a 3001)
EXPOSE 3001

# O comando para iniciar sua app
CMD ["node", "server/index.js"]
