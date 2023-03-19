FROM node:18-alpine
WORKDIR /app
COPY client .
RUN npm install
RUN npx prisma generate
CMD [ "npm", "run", "dev" , "--", "--host" ]
EXPOSE 5173