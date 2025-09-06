# ใช้ Node.js official image
FROM node:20

# ตั้ง working directory
WORKDIR /app

# copy package.json ถ้ามี
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# copy source code ทั้งหมด
COPY . .

# expose port 5000
EXPOSE 5000

# run server
CMD ["node", "server.js"]
