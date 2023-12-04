import * as trpcExpress from "@trpc/server/adapters/express";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";

// created for each request
export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.create({
  transformer: superjson,
});

const baseProcedure = t.procedure

export const publicProcedure = baseProcedure

export const router = t.router
