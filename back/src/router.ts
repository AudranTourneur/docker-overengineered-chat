import { Application } from "express";
import { publicProcedure, router } from "./trpc";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext } from "./trpc";
import { startMetricsServer } from "./common/metrics";
import { getChatMessages } from "./procedures/getChatMessages";
import { z } from "zod";
import { registerOrLogin } from "./procedures/registerOrLogin";

export const appRouter = createRouter();

export type AppRouter = typeof appRouter;

export async function initAllRoute(app: Application) {
  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  startMetricsServer();
}

function createRouter() {
  return router({
    registerOrLogin: publicProcedure.input(z.string().nullable()).mutation(async req => {
        return await registerOrLogin(req.input);
    }),
    getChatMessages: publicProcedure.query(async () => {
      return await getChatMessages();
    }),
  });
}


