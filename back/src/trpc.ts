import * as trpcExpress from "@trpc/server/adapters/express";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { route_request_duration_seconds } from "./common/metrics";

// created for each request
export const createContext = () => ({}); // no context

const t = initTRPC.create({
  transformer: superjson,
});

const loggerMiddleware = t.middleware(async (opts) => {
    console.log(opts.input)

    const start = Date.now()

    const result = await opts.next()

    const durationMs = Date.now() - start
    const meta = { path: opts.path, type: opts.type, durationMs }

    result.ok ? console.log('OK request timing:', meta) : console.error('Non-OK request timing', meta)

    route_request_duration_seconds.observe({ path: opts.path }, durationMs / 1000)

    return result
})

const baseProcedure = t.procedure

export const publicProcedure = baseProcedure.use(loggerMiddleware)

export const router = t.router
