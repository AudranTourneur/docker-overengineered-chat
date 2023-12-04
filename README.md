# docker-overengineered-chat

## Architecture

![App](/demo/architecture.png)

## Abstract & Motivation

This project is a web chat with a database and a powerful monitoring system. <br />
Both the front-end and back-end have been written specifically for this project, it has been an opportunity to play with some of the latest libraries in the JavaScript ecosystem!  <br />
While the chat itself isn't very complex, the goal is to illustrate how to properly monitor a Node.js application and mimic a somewhat realistic production environment, configuring Prometheus, Grafana, Nginx, Postgres, and two Node.js applications to all work together within a Docker network can actually be surprisingly time-consuming and annoying, this project is meant to be a blueprint, the two Node.js apps could easily be swapped with whatever real application you wish to deploy without too much change.

## Demonstration

The chat looks like this:
![App](/demo/chat_image.png)

https://github.com/AudranTourneur/docker-overengineered-chat/assets/108300467/f3ed3d51-4d96-4b38-9886-6040917398fa

The Grafana statistics panel:
![Grafana](/demo/grafana.png)

The pgAdmin interface:
![pgAdmin](/demo/pgadmin.png)

## Images used

### back & front
Both the back-end and the front-end use [Node.js](https://nodejs.org). <br />
The back-end uses the battle-tested Express.js framework, it also uses the [tRPC](https://trpc.io) library for the API and [Drizzle ORM](https://orm.drizzle.team/) for the database.  <br />
The front-end uses [SvelteKit](https://kit.svelte.dev/), [Tailwind](https://tailwindcss.com/) and [SkeletonUI](https://skeleton.dev) for the interface.

### Postgres
The classic and reliable [PostgreSQL](https://www.postgresql.org/) database has been chosen here.  <br />
Default credentials:  <br />
Login: admin  <br />
Password: admin123 

### pgAdmin
The graphical GUI [pgAdmin4](https://www.pgadmin.org/) is used to control the database.  <br />
Default credentials:  <br />
Login: admin@admin.admin  <br />
Password: admin123

### Prometheus
To monitor the application, a [Prometheus](https://prometheus.io/) instance is created, it scraps the data from an endpoint exposed by the backend and store it inside its storage component. It also scraps data from `nginx-exporter` and `postgres-exporter`. All monitoring data is centralized in this instance.

### Grafana
In order to create human-readable visualizations, [Grafana](https://grafana.com/) is used to create an interactive dashboard using Prometheus as a data source.  <br />
Default credentials:  <br />
Login: admin  <br />
Password: admin123

### NGINX
[NGINX](https://www.nginx.com/) acts as a reverse-proxy and is the sole entry-point for the application to the Internet

### nginx-exporter
To make NGINX data readable by Prometheus, an intermediate container is used to analyze NGINX and transform this information ([prometheus-exporter](https://hub.docker.com/r/prometheuscommunity/postgres-exporter))

### postgres-exporter
Similarly, Postgres is analyzed by an another container to generate information readable by Prometheus ([nginx/nginx-prometheus-exporter](https://hub.docker.com/r/nginx/nginx-prometheus-exporter))

## Usage
Just clone this repository and launch the docker-compose.yml file, hopefully, it should "just work".

```
git clone https://github.com/AudranTourneur/docker-overengineered-chat
cd docker-overengineered-chat
docker-compose up
```

NGINX is by default binded to the host port 8888, this port can be changed in the root `.env` file by editing the variable `PORT_NGINX`.

For demonstration purposes, all credentials have been hardcoded and commited to the repository, in a real deployment, please change these credentials and/or use [Docker's secret management system](https://docs.docker.com/compose/use-secrets/)
