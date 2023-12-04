# docker-overengineered-chat

## Architecture

![App](/demo/architecture.png)

## Abstract & Motivation

This project is a web chat with a database and a complete monitoring system.
Both the front-end and back-end have been written specifically for this project, it has been an opportunity to play with some of the latest libraries in the JavaScript ecosystem!
While the chat itself isn't very complex, the goal is to illustrate how to properly monitor a Node.js application and mimic a somewhat realistic production environment, configuring Prometheus, Grafana, Nginx, Postgres, and two Node.js applications to all work together within a Docker network can actually be surprisingly time-consuming and annoying, this project is meant to be a blueprint, the two Node.js apps could easily be swapped with whatever real application you wish to deploy.

## Demonstration

![App](/demo/chat_image.png)

![App](/demo/chat_video.webm)

![Grafana](/demo/grafana.png)

![pgAdmin](/demo/pgadmin.png)

## Images used

### NGINX
NGINX acts as a reverse-proxy and the sole entry-point for the application to the Internet

### back & front
The back-end uses the battle-tested Express.js framework, it also uses the tRPC library for the API and Drizzle ORM for the database.
The front-end uses SvelteKit, Tailwind and Skeleton for the UI.

### Postgres
The classic and reliable PostgreSQL database has been chosen here.

### pgAdmin
The graphical GUI pgAdmin4 is used to control the database.
Default credentials:
Login: admin@admin.admin
Password: admin123

### Prometheus
To monitor the application, a Prometheus instance is created, it scraps the data from an endpoint exposed by the backend and store it inside its storage component.

### Grafana
In order to create human-readable visualizations, Grafana is used to create an interactive dashboard using Prometheus as a data source.
Default credentials:
Login: admin
Password: admin123
