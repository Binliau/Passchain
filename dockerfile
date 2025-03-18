# filepath: c:\Users\kevin\OneDrive\Documents\02_Kuliah\06\Blockchain\passchain-hardhat\dockerfile
FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install -g hardhat && npm install

COPY . .

EXPOSE 8545
CMD ["npx", "hardhat", "node"]