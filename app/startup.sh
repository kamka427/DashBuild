#!/bin/sh

# Run the Prisma migration
npx prisma migrate deploy

# Start the Express server
node express-server.js