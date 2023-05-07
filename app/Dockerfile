FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:18-alpine as runner
WORKDIR /app
COPY .env .
COPY --from=builder /app/build .
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules ./node_modules
RUN npx prisma generate
CMD ["node", "index.js"]

