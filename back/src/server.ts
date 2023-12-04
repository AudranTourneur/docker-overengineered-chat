import express from "express";
import { GlobalEnv } from "./common/env";
import { GlobalLogger } from "./common/logger";
import { initAllRoute } from "./router";

const app = express();
initAllRoute(app)

const port = Number(GlobalEnv.WEB_PORT)
app.listen(port);

GlobalLogger.info(`Back-end application started on port ${port}`);
