import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();

const envSchema = z.object({
    WEB_PORT: z.string().min(1),
    POSTGRES_URL: z.string().min(1),
    PROMETHEUS_PORT: z.string().min(1),
    MINIO_ACCESS_KEY: z.string().min(1),
    MINIO_SECRET_KEY: z.string().min(1),
    MINIO_HOST: z.string().min(1),
    MINIO_PORT: z.string().min(1),
    LOKI_URL: z.string().min(1),
})

export const GlobalEnv = envSchema.parse(process.env);
