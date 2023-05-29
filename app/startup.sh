#!/bin/sh

# Run the Prisma migration
npx prisma migrate deploy

# Start the Express server and pass in the environment variables
node -r dotenv/config express-server.js 