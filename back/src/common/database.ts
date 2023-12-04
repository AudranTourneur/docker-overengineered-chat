import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { GlobalEnv } from './env';

// for query purposes
const queryClient = postgres(GlobalEnv.POSTGRES_URL);
const db = drizzle(queryClient);

export const GlobalDatabaseClient = db;
