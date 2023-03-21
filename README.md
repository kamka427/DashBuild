# DashBuild

Build Grafana dashboards from predefined KPI panels in a No-Code environment

## How to run this project?

- Ensure that you have Node 18 LTS and Docker Desktop / Docker Engine with Docker Compose V2 installed.

- Copy the env example files in the root and app folders and fill them with your personal tokens, secrets and connections.

- While in the root folder, set up the infrastructure of the project.

  > docker compose up -d

- Navigate to the app folder and install the project dependencies.

  > npm install

- Optionally seed the database.

  > npx prisma db seed

- Generate the Prisma client.

  > npx prisma generate

- Serve the project.

  > npm run dev -- --open

- The project will be accessible on port _5173_.

## Infrastructure of the project

![Image](assets/Infra.svg)
