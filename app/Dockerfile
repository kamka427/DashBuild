FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN npx prisma generate
EXPOSE 3000
CMD ORIGIN=http://localhost:3000 node build
