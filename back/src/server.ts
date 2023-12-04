import express from "express";
import { GlobalEnv } from "./common/env";
import { GlobalLogger } from "./common/logger";
import { initAllRoute } from "./router";

const app = express();
initAllRoute(app)

const port = Number(GlobalEnv.WEB_PORT)
const server = app.listen(port);

GlobalLogger.info(`Back-end application started on port ${port}`);

function shutDown() {
    console.log('Received kill signal, shutting down gracefully');
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
}

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
