FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
ADD . .
COPY ../../libs/common/database/schema.prisma prisma/schema.prisma

# Generate prisma types
RUN npm run prisma:generate
RUN npm run build api-gateway