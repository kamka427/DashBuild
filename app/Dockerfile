FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN npx prisma generate
EXPOSE 80
ENV PORT=80
ENV ORIGIN=http://localhost:80
CMD ["npx", "prisma", "migrate", "deploy"] 
ENTRYPOINT ["node", "build" ]
