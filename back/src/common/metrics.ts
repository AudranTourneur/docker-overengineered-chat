import Prometheus from "prom-client";
import express from "express";
import { GlobalEnv } from "./env";

const collectDefaultMetrics = Prometheus.collectDefaultMetrics;
const prefix = "app_";

export const route_request_duration_seconds = new Prometheus.Histogram({
  name: prefix + "route_request_duration_seconds",
  help: "Duration of requests to the server in seconds",
  labelNames: ["path"],
});

export const database_query_duration_seconds = new Prometheus.Histogram({
  name: prefix + "route_query_duration_seconds",
  help: "Duration of queries to the database in seconds",
  labelNames: ["type", "entity"],
});

export async function startMetricsServer() {
  const app = express();
  const port = Number(GlobalEnv.PROMETHEUS_PORT);

  app.get("/metrics", async (_req, res) => {
    console.log("Metrics requested");
    Prometheus.register.clear();
    collectDefaultMetrics({ prefix });
    Prometheus.register.registerMetric(route_request_duration_seconds);
    res.set("Content-Type", Prometheus.register.contentType);
    res.end(await Prometheus.register.metrics());
  });
  const server = app.listen(port, () => {
    console.log(`Metrics server listening at http://localhost:${port}/metrics`);
  });

  function shutDown() {
    console.log(
      "Received kill signal, shutting down gracefully (metrics server)"
    );
    server.close(() => {
      console.log("Closed out remaining connections (metrics server)");
      process.exit(0);
    });

    setTimeout(() => {
      console.error(
        "Could not close connections in time, forcefully shutting down (metrics server)"
      );
      process.exit(1);
    }, 10000);
  }

  process.on("SIGTERM", shutDown);
  process.on("SIGINT", shutDown);
}
