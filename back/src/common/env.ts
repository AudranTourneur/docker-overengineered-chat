import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();

const envSchema = z.object({
    WEB_PORT: z.string().min(1),
    POSTGRES_URL: z.string().min(1),
    PROMETHEUS_PORT: z.string().min(1),
})

export const GlobalEnv = envSchema.parse(process.env);
